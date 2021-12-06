import { ExecutorContext } from "@nrwl/devkit";

export let executorContext: ExecutorContext;

export const setExecutorContext = (ctx: ExecutorContext) => {
  executorContext = ctx;
};
