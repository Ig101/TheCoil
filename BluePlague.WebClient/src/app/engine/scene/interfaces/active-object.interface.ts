import { EnginePlayerAction } from '../../models/engine-player-action.model';
import { ReactionResult } from '../models/reaction-result.model';
import { ActorActionResult } from '../models/actor-action-result.model';

export interface IActiveObject {
  act(action: EnginePlayerAction): ActorActionResult;
}
