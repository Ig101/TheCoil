import { Tag } from '../../scene/models/tag.model';
import { Actor } from '../../scene/objects/actor.object';
import { ActionTag } from '../../scene/models/action-tag.model';
import { registerCryOnWaitTag } from './cry-on-wait.actions';
import { registerFleshTag } from './flesh.actions';

export function getActorTagsRegistry(): { [name: string]: ActionTag<Actor> } {
  return {
    cryOnWait: registerCryOnWaitTag(),
    flesh: registerFleshTag()
  } as { [name: string]: ActionTag<Actor> };
}
