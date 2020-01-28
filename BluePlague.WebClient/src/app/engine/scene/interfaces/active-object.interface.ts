import { EnginePlayerAction } from '../../models/engine-player-action.model';
import { ActorActionResult } from '../models/actor-action-result.model';

export interface IActiveObject {
  act(action: EnginePlayerAction, searchByGroup: boolean): ActorActionResult;
  validateAction(action: EnginePlayerAction, searchByGroup: boolean): boolean;
}
