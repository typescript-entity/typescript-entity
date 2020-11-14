import type { AttrConfig, CallableAttrConfig, WritableAttrConfig } from './Entity';

/**
 * Type Guard for testing that the provided `attrConfig` is a [[`WritableAttrConfig`]].
 *
 * @param attrConfig
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isWritableAttrConfig = (attrConfig: unknown): attrConfig is WritableAttrConfig<any> => (
  isAttrConfig(attrConfig) && 'value' in attrConfig
);

/**
 * Type Guard for testing that the provided `attrConfig` is an [[`AttrConfig`]].
 *
 * @param attrConfig
 */
export const isAttrConfig = (attrConfig: unknown): attrConfig is AttrConfig => (
  attrConfig && 'object' === typeof attrConfig && ('fn' in attrConfig || 'value' in attrConfig)
);

/**
 * Type Guard for testing that the provided `attrConfig` is a [[`CallableAttrConfig`]].
 *
 * @param attrConfig
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isCallableAttrConfig = (attrConfig: unknown): attrConfig is CallableAttrConfig<any> => (
  isAttrConfig(attrConfig) && 'fn' in attrConfig
);
