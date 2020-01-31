import { Scene } from '../scene.object';
import { Actor } from '../objects/actor.object';
import { ReactionResult } from './reaction-result.model';
import { IReactiveObject } from '../interfaces/reactive-object.interface';

export interface IncomingActionReaction<T> {
  weight: number;
  reaction: (scene: Scene, object: T, initiator: Actor, time: number, weight?: number, strength?: number) =>
    { type: string, group: string, reaction: ReactionResult, reachedObjects: IReactiveObject[], strength?: number };
}
