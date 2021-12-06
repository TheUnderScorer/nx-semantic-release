/* eslint-disable @typescript-eslint/no-explicit-any */

declare module 'semantic-release-plugin-decorators' {
  import { Context } from 'semantic-release';
  type PluginFn<Config = unknown> = (
    config: Config,
    context: Context
  ) => Context | Promise<Context>;

  export declare function wrapStep<Config>(
    stepName: string,
    wrapFn: (
      pluginFn: PluginFn<Config>
    ) => PluginFn<Config> | Promise<PluginFn<Config>>,
    config?: { defaultReturn?: any; wrapperName?: any }
  );
}
