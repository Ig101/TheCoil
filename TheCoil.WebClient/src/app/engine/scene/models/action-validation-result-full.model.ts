import { ActionValidationResult } from './action-validation-result.model';
import { EnginePlayerActionFull } from '../../models/engine-player-action-full.model';

export interface ActionValidationResultFull extends ActionValidationResult {
  action: EnginePlayerActionFull;
}
