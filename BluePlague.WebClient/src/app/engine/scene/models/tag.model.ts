import { Scene } from '../scene.object';
import { Actor } from '../objects/actor.object';
import { IncomingActionReaction } from './incoming-action-reaction.model';
import { IReactiveObject } from '../interfaces/reactive-object.interface';
import { TagPriorityEnum } from '../../models/enums/tag-priority.enum';

export interface Tag<T> {
    name: string;
    priority: TagPriorityEnum;
    reactions: { [group: string]: IncomingActionReaction<T> };
}
