import type { ConfigurationFactory } from 'etc/types';


/**
 * Optional helper for users who prefer to have typed configuration files.
 */
export default (userConfigFactory: ConfigurationFactory): ConfigurationFactory => {
  return async context => userConfigFactory(context);
};
