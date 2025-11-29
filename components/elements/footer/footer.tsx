'use client';

import { siteConfig } from '@/config/site';

export function Footer() {
  return (
    <footer className="bg-terminal-bg border-t border-terminal-border dark:border-terminal-border terminal-border">
      <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm font-mono text-gray-600 dark:text-gray-300">
        <p className="text-terminal-cyan dark:text-terminal-cyan">
          {'// © 2025 '}
          {siteConfig.name}
          {'. All rights reserved.'}
        </p>
      </div>
    </footer>
  );
}
