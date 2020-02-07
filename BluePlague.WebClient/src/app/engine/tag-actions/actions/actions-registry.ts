import { ActionTag } from '../../scene/models/action-tag.model';
import { ActorAction } from '../../scene/models/actor-action.model';
import { registerMoveAction } from './move-action.actions';
import { registerWaitAction } from './wait-action.actions';
import { registerSmartAction } from '../actor-smart-action.actions';
import { registerDefaultAttackAction } from './attack-action.action';

export function getActionsRegistry(): { [name: string]: ActorAction } {
  return {
    move: registerMoveAction(),
    wait: registerWaitAction(),
    smart: registerSmartAction(),
    defaultAttack: registerDefaultAttackAction()
  } as { [name: string]: ActorAction };
}
