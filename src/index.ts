import ow from 'ow'

import type {
  UserConfigurationExport,
  UserConfigurationFn,
  UserConfigurationFnContext
} from 'etc/types'

const IS_WRAPPED_CONFIG = Symbol('WRAPPED_CONFIG')

/**
 * Optional helper for users who prefer to have typed configuration files.
 */
export function defineConfig(userConfigArgument: UserConfigurationExport | Array<UserConfigurationExport>) {
  ow(userConfigArgument, 'first argument', ow.any(ow.function, ow.array.ofType(ow.function)))

  // Don't wrap values that have already been wrapped.
  if (Reflect.has(userConfigArgument, IS_WRAPPED_CONFIG)) return userConfigArgument

  // Wrap a single function.
  if (typeof userConfigArgument === 'function') {
    const wrappedConfigFn = async (context: UserConfigurationFnContext) => userConfigArgument(context)
    Reflect.defineProperty(wrappedConfigFn, IS_WRAPPED_CONFIG, { value: true })
    return wrappedConfigFn as UserConfigurationFn
  }

  // Wrap an array.
  const wrappedConfigFn = async (context: UserConfigurationFnContext) => {
    for  (const userConfigurationFn of userConfigArgument) {
      await userConfigurationFn(context)
    }
  }

  Reflect.defineProperty(wrappedConfigFn, IS_WRAPPED_CONFIG, { value: true })

  return wrappedConfigFn
}

export * from 'etc/types'