import { Scene } from '../scene/scene.object';

import { Actor } from '../scene/objects/actor.object';

import { ActorActionResult } from '../scene/models/actor-action-result.model';

import { ReactionMessageLevelEnum } from '../models/enums/reaction-message-level.enum';

import { ActionValidationResult } from '../scene/models/action-validation-result.model';

import { ActorAction } from '../scene/models/actor-action.model';
import { SmartActionEnum } from '../models/enums/smart-action.enum';
import { waitAction, waitValidation } from './actions/wait-action.actions';
import { moveAction, moveValidation } from './actions/move-action.actions';
import { attackValidation, attackAction } from './actions/attack-action.action';

function getActionType(scene: Scene, object: Actor, x: number, y: number): SmartActionEnum {
  if (x - object.x === 0 && y - object.y === 0) {
    return SmartActionEnum.Wait;
  }
  const tile = scene.getTile(x, y);
  if ((x - object.x) <= 1 && (x - object.x) >= -1 && (y - object.y) <= 1 && (y - object.y) >= -1) {
    if (tile.objects.filter(a => !a.passable).length > 0) {
      return SmartActionEnum.Attack;
    }
    return SmartActionEnum.Move;
  }
  return undefined;
}

function actorSmartAction(scene: Scene, object: Actor, x: number, y: number): ActorActionResult {
  const action = getActionType(scene, object, x, y);
  let result: ActorActionResult;
  switch (action) {
    case SmartActionEnum.Move:
      result = moveAction(scene, object, x, y);
      result.type = 'move';
      result.group = 'move';
      break;
    case SmartActionEnum.Attack:
      result = attackAction(scene, object, x, y);
      result.type = 'attack';
      result.group = 'attack';
      break;
    default:
      result = waitAction(scene, object, x, y);
      result.type = 'wait';
      result.group = 'wait';
      break;
  }
  return result;
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
  const action = getActionType(scene, actor, x, y);
  let validationResult: ActionValidationResult;
  let type: string;
  switch (action) {
    case SmartActionEnum.Move:
      validationResult = moveValidation(scene, actor, x, y, false);
      type = 'move';
      break;
    case SmartActionEnum.Wait:
      validationResult = waitValidation(scene, actor, x, y, false);
      type = 'wait';
      break;
    case SmartActionEnum.Attack:
      validationResult = attackValidation(scene, actor, x, y, false);
      type = 'attack';
      break;
    default:
      return {
        success: false
      };
  }
  if (!validationResult.success) {
    return validationResult;
  }
  const tags = actor.calculatedTags;
  for (const tag of tags) {
      const chosenReaction = tag.outgoingReactions[type];
      if (chosenReaction && chosenReaction.validator) {
          const result = chosenReaction.validator(scene, actor, x, y);
          if (result) {
              validationResult.success = false;
              validationResult.reason = result;
              return validationResult;
          }
      }
  }
  return validationResult;
}
