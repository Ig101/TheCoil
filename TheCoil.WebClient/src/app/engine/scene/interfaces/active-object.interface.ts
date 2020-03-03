import { EnginePlayerAction } from '../../models/engine-player-action.model';
import { ActorActionResult } from '../models/actor-action-result.model';
import { ActionValidationResult } from '../models/action-validation-result.model';
import { IReactiveObject } from './reactive-object.interface';
import { ReactionResult } from '../models/reaction-result.model';

export interface IActiveObject extends IReactiveObject {
  act(action: EnginePlayerAction): number;
  validateAction(action: EnginePlayerAction, deep?: boolean): ActionValidationResult;
}
