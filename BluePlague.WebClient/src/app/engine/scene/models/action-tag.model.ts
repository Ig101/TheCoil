import { Actor } from '../objects/actor.object';
import { Tag } from './tag.model';
import { Scene } from '../scene.object';
import { OutgoingActionReaction } from './outgoing-action-reaction.model';

export interface ActionTag {
    name: string;
    interactionTag?: string; // is null, any tag is suitable
    weight?: number;
    reactions: { [id: number]: OutgoingActionReaction };
}
