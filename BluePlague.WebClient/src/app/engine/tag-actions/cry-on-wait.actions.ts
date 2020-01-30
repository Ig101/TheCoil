import { Scene } from '../scene/scene.object';
import { Actor } from '../scene/objects/actor.object';
import { ReactionResult } from '../scene/models/reaction-result.model';
import { ActionTag } from '../scene/models/action-tag.model';
import { ReactionMessageLevelEnum } from '../models/enums/reaction-message-level.enum';

function cryOnWaitWaitOutgoing(scene: Scene, object: Actor, x: number, y: number,
                               weight?: number, strength?: number): ReactionResult  {
  return {
    level: ReactionMessageLevelEnum.Attention,
    message: [object.name, 'cry-on-wait']
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
