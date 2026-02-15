import type { Root, Element, Text } from 'hast';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

const isExternalUrl = (href: string): boolean =>
  href.startsWith('http://') || href.startsWith('https://');

const getTextContent = (node: Element): string => {
  const texts: string[] = [];
  for (const child of node.children) {
    if (child.type === 'text') {
      texts.push((child as Text).value);
    }
  }
  return texts.join('');
};

const isNonWhitespaceText = (node: Element['children'][number]): boolean => {
  if (node.type === 'text') {
    return (node as Text).value.trim().length > 0;
  }
  return node.type === 'element';
};

const isStandaloneLinkParagraph = (node: Element): { href: string } | null => {
  if (node.tagName !== 'p') {
    return null;
  }

  const significantChildren = node.children.filter(isNonWhitespaceText);

  if (significantChildren.length !== 1) {
    return null;
  }

  const child = significantChildren[0];
  if (child.type !== 'element' || (child as Element).tagName !== 'a') {
    return null;
  }

  const anchor = child as Element;
  const href = String(anchor.properties?.href ?? '');

  if (!isExternalUrl(href)) {
    return null;
  }

  const textContent = getTextContent(anchor);
  if (textContent !== href) {
    return null;
  }

  return { href };
};

const isIframelyEmbed = (node: Element): { href: string } | null => {
  if (node.tagName !== 'div') {
    return null;
  }

  const classNames = node.properties?.className;
  if (
    !Array.isArray(classNames) ||
    !classNames.includes('iframely-responsive')
  ) {
    return null;
  }

  const anchor = node.children.find(
    (child): child is Element =>
      child.type === 'element' && child.tagName === 'a',
  );
  if (!anchor) {
    return null;
  }

  const href = String(anchor.properties?.href ?? '');
  if (!isExternalUrl(href)) {
    return null;
  }

  return { href };
};

const detectLinkCard = (node: Element): { href: string } | null =>
  isStandaloneLinkParagraph(node) ?? isIframelyEmbed(node);

export const rehypeLinkCard: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element, index, parent) => {
      if (index === undefined || parent === undefined) {
        return;
      }

      const result = detectLinkCard(node);
      if (!result) {
        return;
      }

      const linkCard: Element = {
        type: 'element',
        tagName: 'link-card',
        properties: { url: result.href },
        children: [],
      };

      parent.children[index] = linkCard;
    });
  };
};
