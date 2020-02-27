import { EnginePlayerAction } from './engine-player-action.model';

export interface EnginePlayerActionFull extends EnginePlayerAction {
  character: string;
  name: string;
  reaction: string;
  animation: string;
}
