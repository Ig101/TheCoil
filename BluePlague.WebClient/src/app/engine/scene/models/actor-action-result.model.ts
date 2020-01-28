import { Tile } from '../tile.object';
import { IReactiveObject } from '../interfaces/reactive-object.interface';
import { ReactionResult } from './reaction-result.model';
export interface ActorActionResult {
  time: number;
  strength?: number;
  reachedObjects: IReactiveObject[];
  reactions: ReactionResult[];
}
