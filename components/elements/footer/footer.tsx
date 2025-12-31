'use client';

import { siteConfig } from '@/config/site';

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
        <p>© 2025 {siteConfig.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}
