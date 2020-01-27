import { Tag } from '../scene/models/tag.model';
import { Actor } from '../scene/objects/actor.object';

export function getActorTagsRegistry(): { [name: string]: Tag<Actor> } {
  const registry = {};

  return registry;
}
