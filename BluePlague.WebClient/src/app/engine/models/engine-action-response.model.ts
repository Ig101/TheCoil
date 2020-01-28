import { SceneChanges } from './scene/scene-changes.model';
import { EngineAction } from './engine-action.model';
import { ReactionResult } from '../scene/models/reaction-result.model';

export interface EngineActionResponse {
    action: EngineAction;
    changes: SceneChanges;
    results: ReactionResult[];
}
