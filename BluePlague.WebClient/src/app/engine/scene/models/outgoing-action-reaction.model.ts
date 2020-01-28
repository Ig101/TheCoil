import { Scene } from '../scene.object';
import { Actor } from '../objects/actor.object';
import { ReactionResult } from './reaction-result.model';

export interface OutgoingActionReaction {
  weight?: number;
  validator?: (scene: Scene, actor: Actor, x: number, y: number) => boolean;
  reaction: (scene: Scene, object: Actor, x: number, y: number, weight?: number, strength?: number) => ReactionResult;
}
