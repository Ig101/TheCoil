import { Scene } from '../scene.object';
import { Actor } from '../objects/actor.object';
import { IncomingActionReaction } from './incoming-action-reaction.model';
import { IReactiveObject } from '../interfaces/reactive-object.interface';

export interface Tag<T> {
    name: string;
    reactions: { [group: string]: IncomingActionReaction<T> };
}
