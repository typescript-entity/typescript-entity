import validator from 'validator';
declare const boolean: (value: boolean) => boolean;
declare const email: (value: string) => boolean;
declare const float: (value: number, options?: validator.IsFloatOptions) => boolean;
declare const integer: (value: number, options?: validator.IsIntOptions) => boolean;
declare const string: (value: string, options?: validator.IsLengthOptions) => boolean;
declare const uuid: (value: string, version?: 3 | 4 | 5 | 'all') => boolean;
export { boolean, email, float, integer, string, uuid, };
