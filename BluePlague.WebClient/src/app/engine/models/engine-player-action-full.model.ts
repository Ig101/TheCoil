import { EnginePlayerAction } from './engine-player-action.model';

export interface EnginePlayerActionFull extends EnginePlayerAction {
  character: string;
  group: string;
}
