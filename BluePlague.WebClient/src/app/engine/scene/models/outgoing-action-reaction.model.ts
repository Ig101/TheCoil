import { Scene } from '../scene.object';
import { Actor } from '../objects/actor.object';
import { ReactionResult } from './reaction-result.model';

export interface OutgoingActionReaction<T> {
  weight?: number;
  validator?: (scene: Scene, object: T, x: number, y: number) => boolean;
  reaction: (scene: Scene, object: T, weight?: number, strength?: number) => void;
}
