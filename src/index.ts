import type { UserConfigurationExport } from 'etc/types';


/**
 * Optional helper for users who prefer to have typed configuration files.
 */
export default function defineConfig(userConfigArgument: UserConfigurationExport): UserConfigurationExport {
  return Array.isArray(userConfigArgument)
    ? userConfigArgument.map(userConfigurationFn => async context => userConfigurationFn(context))
    : async context => userConfigArgument(context);
}


export * from 'etc/types';
