import type { UserConfigurationFn } from './UserConfigurationFn';

/**
 * The value default-exported from a user's configuration file may be either a
 * single function or an array of functions, each of which will be passed a
 * context object.
 */
export type UserConfigurationExport = UserConfigurationFn | Array<UserConfigurationFn>;
