import { Scene } from '../../scene/scene.object';
import { Actor } from '../../scene/objects/actor.object';
import { ReactionResult } from '../../scene/models/reaction-result.model';
import { ActionTag } from '../../scene/models/action-tag.model';
import { ReactionMessageLevelEnum } from '../../models/enums/reaction-message-level.enum';
import { IReactiveObject } from '../../scene/interfaces/reactive-object.interface';
import { TagPriorityEnum } from '../../models/enums/tag-priority.enum';

function cryOnWaitWaitOutgoing(scene: Scene, object: Actor, weight?: number, strength?: number):
    { type: string, group: string, reaction: ReactionResult, reachedObjects: IReactiveObject[], strength?: number }  {
  const reaction = {
    level: ReactionMessageLevelEnum.Attention,
    message: [object.name, 'cries on wait.']
  };
  return {
    type: 'shout',
    group: 'shout',
    reaction,
    reachedObjects: []
  };
}

export function registerCryOnWaitTag(): ActionTag<Actor> {
  return {
    name: 'cryOnWait',
    priority: TagPriorityEnum.AboveBasic,
    reactions: { },
    outgoingReactions: {
      wait: {
        reaction: cryOnWaitWaitOutgoing
      }
    }
  };
}
