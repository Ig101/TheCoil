import { ActionValidationResult } from './action-validation-result.model';
import { EnginePlayerAction } from '../../models/engine-player-action.model';

export interface ActionParsingResult extends ActionValidationResult {
  action: EnginePlayerAction;
}
