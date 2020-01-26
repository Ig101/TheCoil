import { EnginePlayerAction } from './engine-player-action.model';

export interface EngineAction extends EnginePlayerAction {
    actorId: number;
}
