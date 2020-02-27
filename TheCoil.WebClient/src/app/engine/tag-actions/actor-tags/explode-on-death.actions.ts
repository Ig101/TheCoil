import { Scene } from '../../scene/scene.object';
import { Actor } from '../../scene/objects/actor.object';
import { ReactionResult } from '../../scene/models/reaction-result.model';
import { ActionTag } from '../../scene/models/action-tag.model';
import { ReactionMessageLevelEnum } from '../../models/enums/reaction-message-level.enum';
import { IReactiveObject } from '../../scene/interfaces/reactive-object.interface';
import { TagPriorityEnum } from '../../models/enums/tag-priority.enum';
import { rangeBetween } from 'src/app/helpers/math.helper';

function explodeOnDeathDieOutgoing(scene: Scene, object: Actor, weight?: number, strength?: number):
    { animation: string, reaction: string, result: ReactionResult, reachedObjects: IReactiveObject[], range?: number, strength?: number }  {
  const reaction = {
    level: ReactionMessageLevelEnum.Attention,
    message: $localize`:@@game.reaction.explode:${object.name}:name: explodes.`
  };
  const range = weight ? weight : 3;
  const reachedObjects = [];
  for (let x = object.x - range; x <= object.x + range; x++) {
    for (let y = object.y - range; y <= object.y + range; y++) {
      if (rangeBetween(x, y, object.x, object.y) <= range) {
        const tile = scene.getTile(x, y);
        if (tile.native.passable) {
          reachedObjects.push(tile);
          reachedObjects.push(...tile.objects);
        }
      }
    }
  }
  return {
    animation: 'explosion',
    reaction: 'fire',
    result: reaction,
    reachedObjects,
    range,
    strength: 100
  };
}

export function registerExplodeOnDeathTag(): ActionTag<Actor> {
  return {
    name: 'explodeOnDeath',
    priority: TagPriorityEnum.Basic,
    reactions: { },
    outgoingReactions: {
      die: {
        reaction: explodeOnDeathDieOutgoing
      }
    }
  };
}
