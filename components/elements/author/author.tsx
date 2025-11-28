'use client';

import { User } from 'lucide-react';

interface AuthorProps {
  author: string;
}

export function Author({ author }: AuthorProps) {
  return (
    <p className="text-gray-600 dark:text-gray-400 text-base flex items-center">
      <User className="w-3.5 h-3.5 mr-1" />
      {author}
    </p>
  );
}
