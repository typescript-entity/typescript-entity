import type { Configs } from '../entity/Entity';
import { AttrError } from './AttrError';

export class FnAttrError<C extends Configs = Configs> extends AttrError<C> {}
