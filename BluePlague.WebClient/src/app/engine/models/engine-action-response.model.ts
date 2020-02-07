import { SceneChanges } from './scene/scene-changes.model';
import { EngineAction } from './engine-action.model';
import { ReactionResult } from '../scene/models/reaction-result.model';

export interface EngineActionResponse {
    actorId?: number;
    x: number;
    y: number;
    extraIdentifier?: number;
    animation: string;
    changes: SceneChanges;
    result: ReactionResult;
    reachedTiles: {x: number, y: number}[];
}
