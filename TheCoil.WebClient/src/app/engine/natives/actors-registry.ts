import { ActorNative } from '../models/natives/actor-native.model';
import { ActorAction } from '../scene/models/actor-action.model';
import { ActionTag } from '../scene/models/action-tag.model';
import { Actor } from '../scene/objects/actor.object';

export function getActorsRegistry(
  actions: { [tag: string]: ActorAction; },
  actorTags: { [tag: string]: ActionTag<Actor>; }
): { [id: string]: ActorNative; } {
  return {
    player: {
      id: 'player',
      name: 'player',
      sprite: {
        character: '@',
        description: '-',
        color: {r: 255, g: 255, b: 55, a: 1}
      },
      speedModificator: 5,
      weight: 100,
      maxDurability: 100,
      maxEnergy: 100,
      tags: [actorTags.flesh],
      actions: [actions.smart, actions.defaultAttack],
      passable: false
    },
    dummy: {
      id: 'dummy',
      name: $localize`:@@game.actor.dummy:Dummy`,
      sprite: {
        character: '&',
        description: '-',
        color: {r: 255, g: 80, b: 0, a: 1}
      },
      speedModificator: 10,
      weight: 100,
      maxDurability: 100,
      maxEnergy: 100,
      tags: [actorTags.cryOnWait, actorTags.flesh, actorTags.explodeOnDeath],
      actions: [actions.wait],
      passable: false
    }
  };
}

