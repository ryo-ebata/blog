'use client';

import { Calendar } from 'lucide-react';
import { formatDate } from '@/lib/date';

interface TimeProps {
  date: string;
}

export function Time({ date }: TimeProps) {
  return (
    <time className="text-muted-foreground text-sm flex items-center">
      <Calendar className="w-4 h-4 mr-1" />
      {formatDate(date)}
    </time>
  );
}
