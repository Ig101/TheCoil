import { Scene } from '../scene.object';
import { Actor } from '../objects/actor.object';
import { ReactionResult } from './reaction-result.model';
import { IReactiveObject } from '../interfaces/reactive-object.interface';
import { ActionValidationResult } from './action-validation-result.model';

export interface OutgoingActionReaction<T> {
  weight?: number;
  validator?: (scene: Scene, object: T, x: number, y: number) => string[]; // if null -> allowed, if string[] -> not allowed
  reaction: (scene: Scene, object: T, weight?: number, strength?: number) =>
    { type: string, group: string, reaction: ReactionResult, reachedObjects: IReactiveObject[], strength?: number };
}
