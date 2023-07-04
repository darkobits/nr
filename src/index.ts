import type { UserConfigurationFn } from 'etc/types';


/**
 * Optional helper for users who prefer to have typed configuration files.
 */
export function defineConfig(userConfigFactory: UserConfigurationFn): UserConfigurationFn {
  return async context => userConfigFactory(context);
}


export default defineConfig;


export * from 'etc/types';
