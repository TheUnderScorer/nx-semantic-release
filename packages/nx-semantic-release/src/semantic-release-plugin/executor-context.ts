import { ExecutorContext } from '@nx/devkit';

export let executorContext: ExecutorContext;

export const setExecutorContext = (ctx: ExecutorContext) => {
  executorContext = ctx;
};
