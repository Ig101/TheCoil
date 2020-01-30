import { Scene } from '../scene.object';
import { Actor } from '../objects/actor.object';
import { ReactionResult } from './reaction-result.model';

export interface IncomingActionReaction<T> {
  weight: number;
  reaction: (scene: Scene, object: T, initiator: Actor, time: number, weight?: number, strength?: number) => ReactionResult[];
}
