import type { ConfigurationFactoryContext } from './ConfigurationFactoryContext';


/**
 * Signature of configuration factory functions.
 */
export type ConfigurationFactory = (ctx: ConfigurationFactoryContext) => void | Promise<void>;
