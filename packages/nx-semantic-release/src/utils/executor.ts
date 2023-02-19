import { ExecutorOptions } from '../types';

export function unwrapExecutorOptions<T>(options: ExecutorOptions<T>): T {
  if (options && typeof options === 'object' && 'executor' in options) {
    return options.options;
  }

  return options;
}
