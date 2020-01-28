import { Scene } from '../scene.object';
import { Actor } from '../objects/actor.object';
import { ReactionResult } from './reaction-result.model';

export interface ImpactTag {
  name: string;
  strength: number;
  react?: (scene: Scene, object: Actor, x: number, y: number, strength?: number) => string[];
}
