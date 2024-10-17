import type { UserConfigurationFnContext } from './UserConfigurationFnContext'

/**
 * Signature of configuration factory functions.
 */
export type UserConfigurationFn = (ctx: UserConfigurationFnContext) => void | Promise<void>;