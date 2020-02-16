import { SceneChanges } from './scene/scene-changes.model';
import { EngineAction } from './engine-action.model';
import { ReactionResult } from '../scene/models/reaction-result.model';
import { ActorSnapshot } from './scene/objects/actor-snapshot.model';

export interface EngineActionResponse {
    actor?: ActorSnapshot;
    x: number;
    y: number;
    extraIdentifier?: number;
    animation: string;
    changes: SceneChanges;
    result: ReactionResult;
    range?: number;
    reachedTiles: {x: number, y: number}[];
    important: boolean;
}
