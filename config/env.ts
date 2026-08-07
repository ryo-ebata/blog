import { z } from 'zod';

const envSchema = z.object({
  QIITA_API_ACCESS_TOKEN: z.string().optional(),
  QIITA_API_URL: z.string().url().default('https://qiita.com/api/v2'),
  REVALIDATE_SECRET: z.string().optional(),
});

const parseResult = envSchema.safeParse({
  QIITA_API_ACCESS_TOKEN: process.env.QIITA_API_ACCESS_TOKEN,
  QIITA_API_URL: process.env.QIITA_API_URL,
  REVALIDATE_SECRET: process.env.REVALIDATE_SECRET,
});

if (!parseResult.success) {
  throw new Error('Invalid environment variables');
}

const env = parseResult.data;

export const envConfig = {
  qiita: {
    QIITA_API_ACCESS_TOKEN: env.QIITA_API_ACCESS_TOKEN,
    QIITA_API_URL: env.QIITA_API_URL,
  },
  revalidate: {
    REVALIDATE_SECRET: env.REVALIDATE_SECRET,
  },
} as const;
