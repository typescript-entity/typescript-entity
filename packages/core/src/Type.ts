export interface AttrConfigs {
  [name: string]: AttrConfig;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface AttrConfig<V extends AttrValue | AttrValueFn = any> {
  value: V;
  readonly?: boolean;
  normalizer?: AttrNormalizerFn<V>;
  validator?: AttrValidatorFn<V>;
}

export type AttrValue = any;
/* eslint-enable @typescript-eslint/no-explicit-any */

export type AttrValueFn<V extends AttrValue = AttrValue> = () => V;

export type AttrNormalizerFn<V extends AttrValue> = (value: unknown) => V;

export type AttrValidatorFn<V extends AttrValue> = (value: NonNullable<V>) => boolean;

export type AttrInferredValue<V extends AttrValue> = V extends AttrValueFn ? ReturnType<V> : V;

export type AttrInferredValues<C extends AttrConfigs> = {
  [K in keyof C]: AttrInferredValue<C[K]['value']>;
};

export type AttrWritableConfigs<C extends AttrConfigs, AllowReadonly extends boolean = false> = Pick<C, {
  [K in keyof C]: C[K]['value'] extends AttrValueFn ? never : C[K]['readonly'] extends true ? AllowReadonly extends true ? K : never : K;
}[keyof C]>;

export type AttrIncomingValues<C extends AttrConfigs, AllowReadonly extends boolean = false> = AttrInferredValues<AttrWritableConfigs<C, AllowReadonly>>;

export type AttrIncomingValuesUntyped<C extends AttrConfigs, AllowReadonly extends boolean = false> = AttrUntypedValues<AttrWritableConfigs<C, AllowReadonly>>;

export type AttrUntypedValues<C extends AttrConfigs> = Record<keyof C, unknown>;

export type AttrInitialValues<C extends AttrConfigs> = Partial<AttrUntypedValues<AttrWritableConfigs<C, true>>>;

export type EntityInterface<C extends AttrConfigs> = AttrInferredValues<C>;


/*

type MyAttrConfigs = {
  a: AttrConfig<string>;
  b: AttrConfig<() => number>;
  c: AttrConfig<boolean>;
}

const attrConfigs:MyAttrConfigs = {
  a: { value: 'hello' },
  b: { value: () => 123 },
  c: { value: true },
};

function get<K extends keyof MyAttrConfigs, I extends AttrInferredValue<MyAttrConfigs[K]['value']>>(name: K): I {
  const value = attrConfigs[name].value;
  if (isValueFn(value)) {
    return value() as I;
  }
  return value as I;
}

get('b');


/*


type MyAttrConfigs = {
  a: AttrConfig<string>;
  b: AttrConfig<() => number>;
  c: AttrConfig<boolean>;
}

const debug1:MyAttrConfigs = { a: { value: 'abc' }, b: { value: () => 123 }, c: { value: true, readonly: true } };
const debug2:AttrInferredValue<MyAttrConfigs['b']['value']> = 123;
const debug3:AttrInferredValues<MyAttrConfigs> = { a: 'abc', b: 123, c: false };
const debug4:AttrWritableConfigs<MyAttrConfigs> = { a: { value: 'abc' }, c: { readonly: false } };
const debug5:AttrUntypedValues<MyAttrConfigs> = { a: 'abc', b: '123', c: 'a' };
const debug6:AttrInitialValues<MyAttrConfigs> = { a: 'abc', c: false };

console.log(debug1, debug2, debug3, debug4, debug5, debug6);

export class Foo implements EntityInterface<MyAttrConfigs> {

  public a = 'abc';
  public b = 123;
  public c = true;

}









export type WritableAttributes<AN extends AttributeNames, AC extends AttributeConfigs<AN>, AllowReadonly extends boolean = false> = InferredAttributeValues<AN, WritableAttributeConfigs<AN, AC, AllowReadonly>>;

export type RawWritableAttributes<AN extends AttributeNames, AC extends AttributeConfigs<AN>, AllowReadonly extends boolean = false> = Record<keyof WritableAttributeConfigs<AC, AllowReadonly>, unknown>;

export type WithNormalizer<AC extends AttributeConfig<unknown>> = AC & Required<Pick<AC, 'normalizer'>>;

export type WithReadonly<AC extends AttributeConfig<unknown>> = AC & { readonly: true };

export type WithValidator<AC extends AttributeConfig<unknown>> = AC & Required<Pick<AC, 'validator'>>;
*/
