import { ExecutorOptions } from '../types';

export function unwrapExecutorOptions<T>(options: ExecutorOptions<T>): T {
  if ('executor' in options) {
    return options.options;
  }

  return options;
}
