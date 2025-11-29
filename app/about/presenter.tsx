'use client';

import { IconBrandGithub, IconBrandX } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/composites/container';
import { BackLink } from '@/components/elements';
import { MdxHeading } from '@/components/mdx/heading/heading';
import { siteConfig } from '@/config/site';

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-3xl font-bold font-mono text-terminal-cyan dark:text-terminal-cyan terminal-glow">
      {children}
    </h2>
  );
}

function SocialLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-terminal-cyan dark:text-terminal-cyan hover:text-terminal-green dark:hover:text-terminal-green underline transition-colors duration-200 font-mono terminal-glow"
    >
      {label}
    </Link>
  );
}

export function AboutPresenter() {
  return (
    <Container maxWidth="4xl">
      <div className="space-y-12">
        <div className="mb-12 text-center space-y-4">
          <MdxHeading
            as="h1"
            className="text-terminal-green dark:text-terminal-green terminal-glow font-mono"
          >
            $ cat about.txt
          </MdxHeading>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-mono">
            {'// 自己紹介とソーシャルリンク'}
          </p>
        </div>

        <div className="space-y-6">
          <div className="terminal-card rounded-none p-6 font-mono">
            <SectionHeading>[About]</SectionHeading>
            <div className="mt-4 space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                このブログでは、技術的な学びや日々の気づきを共有しています。
                情報（Information）ではなく、知識（Knowledge）と意見（Opinion）と気付き（Insight）を書きます。
              </p>
            </div>
          </div>

          <div className="terminal-card rounded-none p-6 font-mono">
            <SectionHeading>[Links]</SectionHeading>
            <div className="mt-4 space-y-2">
              {siteConfig.links.twitter && (
                <div className="flex items-center gap-2">
                  <IconBrandX />
                  <SocialLink href={siteConfig.links.twitter} label={siteConfig.links.twitter} />
                </div>
              )}
              {siteConfig.links.github && (
                <div className="flex items-center gap-2">
                  <IconBrandGithub />
                  <SocialLink href={siteConfig.links.github} label={siteConfig.links.github} />
                </div>
              )}
              {siteConfig.links.zenn && (
                <div className="flex items-center gap-2">
                  <Image src="/image/zenn-logo/logo-only.svg" alt="Zenn" width={20} height={20} />
                  <SocialLink href={siteConfig.links.zenn} label={siteConfig.links.zenn} />
                </div>
              )}
              {siteConfig.links.qiita && (
                <div className="flex items-center gap-2">
                  <Image
                    src="/image/qiita-icon/qiita-icon.png"
                    alt="Qiita"
                    width={20}
                    height={20}
                  />
                  <SocialLink href={siteConfig.links.qiita} label={siteConfig.links.qiita} />
                </div>
              )}
            </div>
          </div>

          <div className="text-end">
            <BackLink href="/" label="$ cd .. # ホームに戻る" />
          </div>
        </div>
      </div>
    </Container>
  );
}
