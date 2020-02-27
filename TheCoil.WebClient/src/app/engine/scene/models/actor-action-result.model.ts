import { Tile } from '../tile.object';
import { IReactiveObject } from '../interfaces/reactive-object.interface';
import { ReactionResult } from './reaction-result.model';
import { Actor } from '../objects/actor.object';
export interface ActorActionResult {
  name?: string;
  animation?: string;
  reaction?: string;
  time: number;
  strength?: number;
  actor: Actor;
  reachedObjects: IReactiveObject[];
  result: ReactionResult;
  range?: number;
}
