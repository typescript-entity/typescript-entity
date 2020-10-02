import validator from 'validator';

export type IsAfterOptions = { now?: Date };

export type IsBeforeOptions = { now?: Date };

export type IsEmailOptions = validator.IsEmailOptions;

export type IsFloatOptions = validator.IsFloatOptions;

export type IsIntegerOptions = validator.IsIntOptions;

export type IsLengthOptions = validator.IsLengthOptions;

export type IsNegativeFloatOptions = Exclude<IsFloatOptions, 'lt'>

export type IsNegativeIntegerOptions = Exclude<IsIntegerOptions, 'lt'>

export type IsPositiveFloatOptions = Exclude<IsFloatOptions, 'gt'>

export type IsPositiveIntegerOptions = Exclude<IsIntegerOptions, 'gt'>

export type IsURLOptions = validator.IsURLOptions;

export type IsUUIDOptions = { version?: validator.UUIDVersion };
