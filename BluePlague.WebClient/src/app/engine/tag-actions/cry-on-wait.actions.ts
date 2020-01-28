import { Scene } from '../scene/scene.object';
import { Actor } from '../scene/objects/actor.object';
import { ReactionResult } from '../scene/models/reaction-result.model';
import { ActorTag } from '../scene/models/actor-tag.model';

function cryOnWaitWaitOutgoing(scene: Scene, object: Actor, x: number, y: number,
                               weight?: number, strength?: number): ReactionResult  {
  return {
    time: 0,
    message: [object.name, 'cry-on-wait']
  };
}

export function registerCryOnWaitTag(): ActorTag {
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
