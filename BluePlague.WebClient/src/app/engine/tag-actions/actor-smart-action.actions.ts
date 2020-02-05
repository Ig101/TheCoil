import { Scene } from '../scene/scene.object';

import { Actor } from '../scene/objects/actor.object';

import { ActorActionResult } from '../scene/models/actor-action-result.model';

import { ReactionMessageLevelEnum } from '../models/enums/reaction-message-level.enum';

import { ActionValidationResult } from '../scene/models/action-validation-result.model';

import { ActorAction } from '../scene/models/actor-action.model';

function actorSmartAction(scene: Scene, object: Actor, x: number, y: number, externalIdentifier?: number): ActorActionResult {
  if (x - object.x === 0 && y - object.y === 0) {
    const timeShift = object.calculatedSpeedModification;
    return {
      time: timeShift,
      reaction: {
        level: ReactionMessageLevelEnum.Trace,
        message: [object.name, 'waited.']
      },
      reachedObjects: [object.tile, ...object.tile.objects.filter(o => o !== object)],
      type: 'wait',
      group: 'wait'
    };
  }
  if ((x - object.x) <= 1 && (x - object.x) >= -1 && (y - object.y) <= 1 && (y - object.y) >= -1) {
    // TODO Attack
    const timeShift = object.calculatedSpeedModification;
    const tile = scene.getTile(x, y);
    object.changePositionToTile(tile);
    return {
      time: timeShift,
      reachedObjects: [tile, ...tile.objects.filter(o => o !== object)],
      reaction: {
        level: ReactionMessageLevelEnum.Trace,
        message: [object.name, 'moved.']
      },
      type: 'move',
      group: 'move'
    } as ActorActionResult;
  }
}

export function registerSmartAction(): ActorAction {
  return {
    character: '@',
    name: 'smart',
    group: 'smart',
    validator: () => {
                  return { success: false };
                },
    action: actorSmartAction
  } as ActorAction;
}

export function actorSmartValidation(scene: Scene, actor: Actor, x: number, y: number): ActionValidationResult {
  if (actor.remainedTurnTime > 0 || (x - actor.x) > 1 || (x - actor.x) < -1 ||
    (y - actor.y) > 1 || (y - actor.y) < -1) {
    return {
      success: false
    };
  }
  const tile = scene.getTile(x, y);
  if (!tile.passable) {
    return {
      success: false,
      reason: ['tileIsNotPassable']
    };
  }
  return {
    success: true
  };
}
