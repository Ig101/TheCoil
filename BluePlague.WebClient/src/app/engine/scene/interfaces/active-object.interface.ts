import { EnginePlayerAction } from '../../models/engine-player-action.model';
import { ActorActionResult } from '../models/actor-action-result.model';

export interface IActiveObject {
  act(action: EnginePlayerAction): ActorActionResult;
  validateAction(action: EnginePlayerAction): boolean;
}
