'use client';

import { siteConfig } from '@/config/site';

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>© 2025 {siteConfig.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}
