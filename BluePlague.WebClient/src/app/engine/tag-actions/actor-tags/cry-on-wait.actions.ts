import { Scene } from '../../scene/scene.object';
import { Actor } from '../../scene/objects/actor.object';
import { ReactionResult } from '../../scene/models/reaction-result.model';
import { ActionTag } from '../../scene/models/action-tag.model';
import { ReactionMessageLevelEnum } from '../../models/enums/reaction-message-level.enum';
import { IReactiveObject } from '../../scene/interfaces/reactive-object.interface';
import { TagPriorityEnum } from '../../models/enums/tag-priority.enum';

function cryOnWaitWaitOutgoing(scene: Scene, object: Actor, weight?: number, strength?: number):
    { animation: string, reaction: string, result: ReactionResult, reachedObjects: IReactiveObject[] }  {
  const reaction = {
    level: ReactionMessageLevelEnum.Attention,
    message: $localize`:@@game.reaction.alert:${object.name}:name: makes alert noises.`
  };
  return {
    animation: 'shout',
    reaction: 'shout',
    result: reaction,
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
