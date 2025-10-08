type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';

const env = (import.meta as any).env || {};
const isProd = env.PROD === true || env.MODE === 'production';
const levelFromEnv = (env.VITE_LOG_LEVEL as LogLevel) || (isProd ? 'warn' : 'debug');

const shouldLog = (msgLevel: LogLevel) => {
  const order: Record<LogLevel, number> = { debug: 10, info: 20, warn: 30, error: 40, silent: 100 };
  return order[msgLevel] >= order[levelFromEnv];
};

export const logger = {
  debug: (...args: unknown[]) => {
    if (!isProd && shouldLog('debug')) console.debug(...args);
  },
  info: (...args: unknown[]) => {
    if (shouldLog('info')) console.info(...args);
  },
  warn: (...args: unknown[]) => {
    if (shouldLog('warn')) console.warn(...args);
  },
  error: (...args: unknown[]) => {
    if (shouldLog('error')) console.error(...args);
  },
};


