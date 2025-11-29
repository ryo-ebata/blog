'use client';

import { Calendar } from 'lucide-react';
import { formatDate } from '@/utils/date';

interface TimeProps {
  date: string;
}

export function Time({ date }: TimeProps) {
  return (
    <time className="text-gray-600 dark:text-gray-300 text-base flex items-center font-mono">
      <Calendar className="w-4 h-4 mr-1 text-terminal-cyan dark:text-terminal-cyan" />
      {formatDate(date)}
    </time>
  );
}
