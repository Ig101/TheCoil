import { Scene } from '../scene/scene.object';

import { Actor } from '../scene/objects/actor.object';
import { ActorActionResult } from '../scene/models/actor-action-result.model';
import { ActorAction } from '../scene/models/actor-action.model';
import { ActionValidationResult } from '../scene/models/action-validation-result.model';
import { ReactionMessageLevelEnum } from '../models/enums/reaction-message-level.enum';

function moveAction(scene: Scene, object: Actor, x: number, y: number, externalIdentifier?: number): ActorActionResult {
  const timeShift = object.calculatedSpeedModification;
  const tile = scene.getTile(x, y);
  object.changePositionToTile(tile);
  return {
    time: timeShift,
    reachedObjects: [tile, ...tile.objects.filter(o => o !== object)],
    reaction: {
      level: ReactionMessageLevelEnum.Trace,
      message: [object.name, ' moved.']
    }
  } as ActorActionResult;
}

function moveValidation(scene: Scene, actor: Actor, x: number, y: number, deep: boolean,
                        externalIdentifier?: number): ActionValidationResult {
  if (this.remainedTurnTime >= 0 || (Math.abs(x - actor.x) !== 1 && Math.abs(x - actor.x) !== 1)) {
    return {
      success: false
    };
  }
  const tile = this.parent.getTile(x, y);
  if (!tile.passable || tile.objects.filter(o => !o.passable).length > 0) {
    return {
      success: false
    };
  }
  return {
    success: true
  };
}

export function registerMoveAction(): ActorAction {
  return {
    name: 'move',
    group: 'move',
    validator: moveValidation,
    action: moveAction
  } as ActorAction;
}

