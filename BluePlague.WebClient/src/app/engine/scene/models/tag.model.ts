import { Scene } from '../scene.object';
import { Actor } from '../objects/actor.object';
import { IncomingActionReaction } from './incoming-action-reaction.model';

export interface Tag<T> {
    name: string;
    interactionTag?: string; // is null, any tag is suitable
    weight?: number;
    targetActionReactions: { [id: number]: IncomingActionReaction<T> };
}
