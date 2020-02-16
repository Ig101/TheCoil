import { Scene } from '../scene/scene.object';

import { Actor } from '../scene/objects/actor.object';

import { ActorActionResult } from '../scene/models/actor-action-result.model';

import { ReactionMessageLevelEnum } from '../models/enums/reaction-message-level.enum';

import { ActionValidationResult } from '../scene/models/action-validation-result.model';

import { ActorAction } from '../scene/models/actor-action.model';
import { SmartActionEnum } from '../models/enums/smart-action.enum';
import { waitAction, waitValidation } from './actions/wait-action.actions';
import { moveAction, moveValidation } from './actions/move-action.actions';
import { defaultAttackValidation, attackAction } from './actions/attack-action.action';

function getActionType(scene: Scene, object: Actor, x: number, y: number): SmartActionEnum {
  if (x - object.x === 0 && y - object.y === 0) {
    return SmartActionEnum.Wait;
  }
  const tile = scene.getTile(x, y);
  if ((x - object.x) <= 1 && (x - object.x) >= -1 && (y - object.y) <= 1 && (y - object.y) >= -1) {
    if (tile.objects.filter(a => !a.native.passable).length > 0) {
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
      result.name = 'move';
      if (!result.animation) {
        result.animation = 'move';
      }
      if (!result.reaction) {
        result.reaction = 'move';
      }
      break;
    case SmartActionEnum.Attack:
      result = attackAction(scene, object, x, y);
      result.name = 'defaultAttack';
      if (!result.animation) {
        result.animation = 'attack';
      }
      if (!result.reaction) {
        result.reaction = 'physical';
      }
      break;
    default:
      result = waitAction(scene, object, x, y);
      result.name = 'wait';
      if (!result.animation) {
        result.animation = 'wait';
      }
      if (!result.reaction) {
        result.reaction = 'wait';
      }
      break;
  }
  return result;
}

export function registerSmartAction(): ActorAction {
  return {
    character: '@',
    name: '',
    id: 'smart',
    reaction: 'smart',
    animation: 'smart',
    validator: () => {
                  return { success: false };
                },
    action: actorSmartAction
  } as ActorAction;
}

export function actorSmartValidation(scene: Scene, actor: Actor, x: number, y: number): ActionValidationResult {
  const action = getActionType(scene, actor, x, y);
  let validationResult: ActionValidationResult;
  let reaction: string;
  switch (action) {
    case SmartActionEnum.Move:
      validationResult = moveValidation(scene, actor, x, y, false);
      reaction = 'move';
      break;
    case SmartActionEnum.Wait:
      validationResult = waitValidation(scene, actor, x, y, false);
      reaction = 'wait';
      break;
    case SmartActionEnum.Attack:
      validationResult = defaultAttackValidation(scene, actor, x, y, false);
      reaction = 'defaultAttack';
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
      const chosenReaction = tag.outgoingReactions[reaction];
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
