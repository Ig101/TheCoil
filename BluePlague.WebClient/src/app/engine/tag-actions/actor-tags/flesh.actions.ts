import { Scene } from '../../scene/scene.object';
import { Actor } from '../../scene/objects/actor.object';
import { ReactionResult } from '../../scene/models/reaction-result.model';
import { ActionTag } from '../../scene/models/action-tag.model';
import { ReactionMessageLevelEnum } from '../../models/enums/reaction-message-level.enum';
import { IReactiveObject } from '../../scene/interfaces/reactive-object.interface';
import { TagPriorityEnum } from '../../models/enums/tag-priority.enum';
import { receiveDamageAttackIncoming } from './basic.actions';

export function registerFleshTag(): ActionTag<Actor> {
  return {
    name: 'flesh',
    priority: TagPriorityEnum.Basic,
    reactions: {
      attack: {
        reaction: receiveDamageAttackIncoming,
        weight: 1
      }
    },
    outgoingReactions: { }
  };
}
