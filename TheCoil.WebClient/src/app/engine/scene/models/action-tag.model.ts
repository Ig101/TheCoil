import { Actor } from '../objects/actor.object';
import { Tag } from './tag.model';
import { Scene } from '../scene.object';
import { OutgoingActionReaction } from './outgoing-action-reaction.model';

export interface ActionTag<T> extends Tag<T> {
    outgoingReactions: { [group: string]: OutgoingActionReaction<T> };
}
