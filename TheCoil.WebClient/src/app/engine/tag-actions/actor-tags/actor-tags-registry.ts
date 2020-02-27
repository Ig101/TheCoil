import { Tag } from '../../scene/models/tag.model';
import { Actor } from '../../scene/objects/actor.object';
import { ActionTag } from '../../scene/models/action-tag.model';
import { registerCryOnWaitTag } from './cry-on-wait.actions';
import { registerFleshTag } from './flesh.actions';
import { registerExplodeOnDeathTag } from './explode-on-death.actions';

export function getActorTagsRegistry(): { [name: string]: ActionTag<Actor> } {
  return {
    cryOnWait: registerCryOnWaitTag(),
    flesh: registerFleshTag(),
    explodeOnDeath: registerExplodeOnDeathTag(),
  } as { [name: string]: ActionTag<Actor> };
}
