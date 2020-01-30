import { EnginePlayerAction } from '../../models/engine-player-action.model';
import { ActorActionResult } from '../models/actor-action-result.model';
import { ActionValidationResult } from '../models/action-validation-result.model';

export interface IActiveObject {
  act(action: EnginePlayerAction): number;
  validateAction(action: EnginePlayerAction, deep?: boolean): ActionValidationResult;
}
