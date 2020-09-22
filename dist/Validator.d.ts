import validator from 'validator';
export declare const boolean: (value: boolean) => boolean;
export declare const email: (value: string, options?: validator.IsEmailOptions) => boolean;
export declare const float: (value: number, options?: validator.IsFloatOptions) => boolean;
export declare const integer: (value: number, options?: validator.IsIntOptions) => boolean;
export declare const string: (value: string, options?: validator.IsLengthOptions) => boolean;
export declare const uuid: (value: string, version?: validator.UUIDVersion) => boolean;
