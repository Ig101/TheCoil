import { Tile } from '../tile.object';
import { IReactiveObject } from '../interfaces/reactive-object.interface';
import { ImpactTag } from './impact-tag.model';

export interface ActorActionResult {
  time: number;
  message: string[];
  strength?: number;
  impactTags?: ImpactTag[];
  reachedObjects: IReactiveObject[];
}
