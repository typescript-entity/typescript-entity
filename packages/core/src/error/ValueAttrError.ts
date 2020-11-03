import type { Configs } from "../entity/Entity";
import { AttrError } from "./AttrError";

export class ValueAttrError<C extends Configs = Configs> extends AttrError<C> {}
