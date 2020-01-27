import { Actor } from '../objects/actor.object';
import { Tag } from './tag.model';
import { Scene } from '../scene.object';
import { SelfActionReaction } from './self-action-reaction.model';

export interface ActorTag extends Tag<Actor> {
    selfActionReactions: { [id: number]: SelfActionReaction };
}
