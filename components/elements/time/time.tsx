'use client';

import { Calendar } from 'lucide-react';
import { formatDate } from '@/utils/date';

interface TimeProps {
  date: string;
}

export function Time({ date }: TimeProps) {
  return (
    <time className="text-gray-600 dark:text-gray-400 text-base flex items-center">
      <Calendar className="w-3.5 h-3.5 mr-1" />
      {formatDate(date)}
    </time>
  );
}
