import { EnginePlayerAction } from './engine-player-action.model';

export interface EnginePlayerActionFull extends EnginePlayerAction {
  character: string;
  reaction: string;
  animation: string;
}
