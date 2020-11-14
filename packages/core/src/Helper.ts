import { Entity } from './Entity';
import type { AttrConfigSet, EntityConstructor, EntityWithAccessorsConstructor, ResolveAttrName, ResolveMutableAttrName, ResolveMutableAttrSet, ResolveWritableAttrSet } from './Entity';
import { isWritableAttrConfig } from './TypeGuard';

/**
 * Helper function for generating an [[`Entity`]] constructor from the provided `attrConfigSet`. The
 * generated class includes accessors for each attribute.
 *
 * @param attrConfig
 */
export const entity = <ACS extends AttrConfigSet>(attrConfigSet: ACS): EntityWithAccessorsConstructor<ACS, Entity<ACS>> => (
  withAccessors(attrConfigSet, constructor(attrConfigSet))
);

/**
 * Helper function for generating an [[`Entity`]] constructor from the provided `attrConfigSet`. It
 * is recommended to use [[`entity()`]] instead, unless you do not need/want accessors.
 *
 * @param attrConfig
 */
export const constructor = <ACS extends AttrConfigSet>(attrConfigSet: ACS): EntityConstructor<ACS> => (
  class extends Entity<ACS> {
    constructor(data: Partial<ResolveWritableAttrSet<ACS>> | Entity<ACS> | string = {}) {
      super(attrConfigSet, data);
    }
  }
);

/**
 * Helper function for binding accessors for attributes in the provided `attrConfigSet` to an
 * existing [[`Entity`]] `Constructor`. It is recommended to use [[`entity()`]] instead, unless you
 * are rolling your own constructors.
 *
 * @param attrConfig
 * @param Constructor
 */
export const withAccessors = <ACS extends AttrConfigSet, C extends EntityConstructor<ACS>>(attrConfigSet: ACS, Constructor: C): EntityWithAccessorsConstructor<ACS, InstanceType<C>> => {
  Object.entries(attrConfigSet).forEach(([ name, attrConfig ]) => {
    const props: PropertyDescriptor = {
      enumerable: !attrConfig.hidden,
      get: function(this: Entity<ACS>) {
        return this.one(name as ResolveAttrName<ACS>);
      },
    };

    if (isWritableAttrConfig(attrConfig) && !attrConfig.immutable) {
      props.set = function(this: Entity<ACS>, value: unknown) {
        const typedName = name as ResolveMutableAttrName<ACS>;
        return this.set(typedName, value as ResolveMutableAttrSet<ACS>[typeof typedName]);
      };
    }

    Object.defineProperty(Constructor.prototype, name, props);
  });

  return Constructor as unknown as EntityWithAccessorsConstructor<ACS, InstanceType<C>>;
};
