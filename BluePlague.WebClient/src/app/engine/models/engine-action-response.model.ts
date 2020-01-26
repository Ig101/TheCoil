import { SceneChanges } from './scene/scene-changes.model';
import { EngineAction } from './engine-action.model';

export interface EngineActionResponse {
    action: EngineAction;
    changes: SceneChanges;
}
