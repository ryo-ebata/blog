'use client';

import { Separator } from '@/components/atoms/separator';
import { siteConfig } from '@/config/site';

const footerLinks = [
  { href: siteConfig.links.github, label: 'GitHub' },
  { href: siteConfig.links.zenn, label: 'Zenn' },
  { href: siteConfig.links.qiita, label: 'Qiita' },
  { href: siteConfig.links.twitter, label: 'X' },
];

export const Footer = () => (
  <footer className="bg-background">
    <Separator />
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        {footerLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {link.label}
          </a>
        ))}
      </nav>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        © 2025 {siteConfig.name}. All rights reserved.
      </p>
    </div>
  </footer>
);
