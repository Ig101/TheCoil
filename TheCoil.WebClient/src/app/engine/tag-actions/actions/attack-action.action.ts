import { Scene } from '../../scene/scene.object';
import { Actor } from '../../scene/objects/actor.object';
import { ActorActionResult } from '../../scene/models/actor-action-result.model';
import { ReactionMessageLevelEnum } from '../../models/enums/reaction-message-level.enum';
import { ActionValidationResult } from '../../scene/models/action-validation-result.model';
import { ActorAction } from '../../scene/models/actor-action.model';

export function attackAction(scene: Scene, object: Actor, x: number, y: number, externalIdentifier?: number): ActorActionResult {
  const timeShift = object.calculatedSpeedModification;
  const tile = scene.getTile(x, y);
  let livingTarget: Actor;
  if (tile.objects.length === 1) {
    livingTarget = tile.objects[0];
  } else {
    livingTarget = tile.objects.find(a => !a.native.passable);
  }
  return {
    time: timeShift,
    reachedObjects: [tile, ...(livingTarget ? [livingTarget] : tile.objects.filter(o => o !== object))],
    strength: 10,
    result: {
      level: ReactionMessageLevelEnum.Trace,
      message: $localize`:@@game.reaction.action.defaultAttack:${object.name}:name:
        attacks ${livingTarget ? livingTarget.name : $localize`:@@game.reaction.action.defaultAttack.area:area`}:target:.`
    },
    actor: object
  } as ActorActionResult;
}

export function defaultAttackValidation(scene: Scene, actor: Actor, x: number, y: number, deep: boolean,
                                        externalIdentifier?: number): ActionValidationResult {
  if (actor.remainedTurnTime > 0 || (x - actor.x) > 1 || (x - actor.x) < -1 ||
    (y - actor.y) > 1 || (y - actor.y) < -1 || ((y - actor.y) === 0 && (x - actor.x) === 0)) {
    return {
      success: false
    };
  }
  const tile = scene.getTile(x, y);
  if (tile.objects.length === 0) {
    return {
      success: false
    };
  }
  return {
    success: true
  };
}

export function registerDefaultAttackAction(): ActorAction {
  return {
    character: 'A',
    name: $localize`:@@game.action.defaultAttack:attack`,
    id: 'defaultAttack',
    reaction: 'physical',
    animation: 'attack',
    validator: defaultAttackValidation,
    action: attackAction
  } as ActorAction;
}

