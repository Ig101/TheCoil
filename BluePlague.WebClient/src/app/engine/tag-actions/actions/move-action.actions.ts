import { Scene } from '../../scene/scene.object';

import { Actor } from '../../scene/objects/actor.object';
import { ActorActionResult } from '../../scene/models/actor-action-result.model';
import { ActorAction } from '../../scene/models/actor-action.model';
import { ActionValidationResult } from '../../scene/models/action-validation-result.model';
import { ReactionMessageLevelEnum } from '../../models/enums/reaction-message-level.enum';

export function moveAction(scene: Scene, object: Actor, x: number, y: number, externalIdentifier?: number): ActorActionResult {
  const timeShift = object.calculatedSpeedModification;
  const tile = scene.getTile(x, y);
  object.changePositionToTile(tile);
  return {
    time: timeShift,
    reachedObjects: [tile, ...tile.objects.filter(o => o !== object)],
    result: {
      level: ReactionMessageLevelEnum.Trace,
      message: $localize`:@@game.reaction.action.move:${object.name}:name: moves.`
    },
    actor: object
  } as ActorActionResult;
}

export function moveValidation(scene: Scene, actor: Actor, x: number, y: number, deep: boolean,
                               externalIdentifier?: number): ActionValidationResult {
  if (actor.remainedTurnTime > 0 || (x - actor.x) > 1 || (x - actor.x) < -1 ||
    (y - actor.y) > 1 || (y - actor.y) < -1 || ((y - actor.y) === 0 && (x - actor.x) === 0)) {
    return {
      success: false
    };
  }
  const tile = scene.getTile(x, y);
  if (!tile.native.passable || tile.objects.filter(o => !o.native.passable).length > 0) {
    return {
      success: false,
      reason: $localize`:@@game.reaction.validation.move:${actor.name}:name: faces obstacle.`
    };
  }
  return {
    success: true
  };
}

export function registerMoveAction(): ActorAction {
  return {
    character: 'M',
    name: $localize`:@@game.action.move:move`,
    id: 'move',
    reaction: 'move',
    animation: 'move',
    validator: moveValidation,
    action: moveAction
  } as ActorAction;
}

