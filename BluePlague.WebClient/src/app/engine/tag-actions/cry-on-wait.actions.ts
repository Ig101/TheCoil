import { Scene } from '../scene/scene.object';
import { Actor } from '../scene/objects/actor.object';
import { ReactionResult } from '../scene/models/reaction-result.model';
import { ActionTag } from '../scene/models/action-tag.model';
import { ReactionMessageLevelEnum } from '../models/enums/reaction-message-level.enum';
import { IReactiveObject } from '../scene/interfaces/reactive-object.interface';

function cryOnWaitWaitOutgoing(scene: Scene, object: Actor, weight?: number, strength?: number):
    { type: string, group: string, reaction: ReactionResult, reachedObjects: IReactiveObject[], strength?: number }  {
  const reaction = {
    level: ReactionMessageLevelEnum.Attention,
    message: [object.name, 'criedOnWait.']
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
    reactions: { },
    outgoingReactions: {
      wait: {
        reaction: cryOnWaitWaitOutgoing
      }
    }
  };
}
