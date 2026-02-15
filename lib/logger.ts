interface LogContext {
  source: string;
  [key: string]: unknown;
}

const formatError = (error: unknown): { message: string; stack?: string } => {
  if (error instanceof Error) {
    return { message: error.message, stack: error.stack };
  }
  return { message: String(error) };
};

export const logger = {
  error: (message: string, context: LogContext, error?: unknown): void => {
    const payload: Record<string, unknown> = {
      level: 'error',
      message,
      ...context,
      timestamp: new Date().toISOString(),
    };
    if (error !== undefined) {
      payload.error = formatError(error);
    }
    console.error(JSON.stringify(payload));
  },

  warn: (message: string, context: LogContext): void => {
    console.warn(
      JSON.stringify({
        level: 'warn',
        message,
        ...context,
        timestamp: new Date().toISOString(),
      })
    );
  },
};
