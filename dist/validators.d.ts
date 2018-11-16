/// <reference types="validator" />
declare const boolean: (value: boolean) => boolean;
declare const email: (value: string) => boolean;
declare const float: (value: number, options?: ValidatorJS.IsFloatOptions) => boolean;
declare const integer: (value: number, options?: ValidatorJS.IsIntOptions) => boolean;
declare const string: (value: string, options?: ValidatorJS.IsLengthOptions) => boolean;
declare const uuid: (value: string, version?: "all" | 5 | 4 | 3) => boolean;
export { boolean, email, float, integer, string, uuid, };
