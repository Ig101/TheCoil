import { Scene } from '../../scene/scene.object';
import { Actor } from '../../scene/objects/actor.object';
import { ActorActionResult } from '../../scene/models/actor-action-result.model';
import { ActorAction } from '../../scene/models/actor-action.model';
import { ReactionMessageLevelEnum } from '../../models/enums/reaction-message-level.enum';
import { ActionValidationResult } from '../../scene/models/action-validation-result.model';

export function waitValidation(scene: Scene, actor: Actor, x: number, y: number, deep: boolean,
                               externalIdentifier?: number): ActionValidationResult {
  if (actor.remainedTurnTime > 0 || x - actor.x !== 0 || y - actor.y !== 0) {
    return {
      success: false
    };
  }
  return {
    success: true
  };
}

export function waitAction(scene: Scene, object: Actor, x: number, y: number, externalIdentifier?: number): ActorActionResult {
  const timeShift = object.calculatedSpeedModification;
  return {
    time: timeShift,
    result: {
      level: ReactionMessageLevelEnum.Trace,
      message: $localize`:@@game.reaction.action.wait:${object.name}:name: waits.`
    },
    reachedObjects: [object.tile, ...object.tile.objects.filter(o => o !== object)],
    actor: object
  };
}

export function registerWaitAction(): ActorAction {
  return {
    character: 'W',
    id: 'wait',
    name: $localize`:@@game.action.wait:wait`,
    reaction: 'wait',
    animation: 'wait',
    action: waitAction,
    validator: waitValidation
  } as ActorAction;
}
