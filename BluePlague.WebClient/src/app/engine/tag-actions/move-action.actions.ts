import { Scene } from '../scene/scene.object';

import { Actor } from '../scene/objects/actor.object';
import { ActorActionResult } from '../scene/models/actor-action-result.model';
import { ActorAction } from '../scene/models/actor-action.model';
import { ActionValidationResult } from '../scene/models/action-validation-result.model';

function moveAction(scene: Scene, object: Actor, x: number, y: number, externalIdentifier?: number): ActorActionResult {
  const timeShift = object.calculatedSpeedModification;
  const tile = scene.getTile(x, y);
  object.changePositionToTile(tile);
  return {
    time: timeShift,
    reachedObjects: [tile, ...tile.objects.filter(o => o !== object)],
    reactions: []
  } as ActorActionResult;
}

function moveValidation(scene: Scene, actor: Actor, x: number, y: number, externalIdentifier?: number): ActionValidationResult {
  if (this.remainedTurnTime > 0 || x - actor.x > 1 || y - actor.y > 1 || x - actor.x < -1 || y - actor.y < -1) {
    return {
      success: false
    };
  }
  const tile = this.parent.getTile(x, y);
  if (!tile.passable || tile.objects.filter(o => (o instanceof Actor && !o.passable)).length > 0) {
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

