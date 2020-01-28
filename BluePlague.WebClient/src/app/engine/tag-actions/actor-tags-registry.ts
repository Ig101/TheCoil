import { Tag } from '../scene/models/tag.model';
import { Actor } from '../scene/objects/actor.object';
import { ActorTag } from '../scene/models/actor-tag.model';
import { registerCryOnWaitTag } from './cry-on-wait.actions';

export function getActorTagsRegistry(): { [name: string]: ActorTag } {
  return {
    cryOnWait: registerCryOnWaitTag()
  } as { [name: string]: ActorTag };
}
