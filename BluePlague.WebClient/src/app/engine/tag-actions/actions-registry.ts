import { ActionTag } from '../scene/models/action-tag.model';
import { ActorAction } from '../scene/models/actor-action.model';
import { registerMoveAction } from './move-action.actions';
import { registerWaitAction } from './wait-action.actions';

export function getActionsRegistry(): { [name: string]: ActorAction } {
  return {
    move: registerMoveAction(),
    wait: registerWaitAction()
  } as { [name: string]: ActorAction };
}
