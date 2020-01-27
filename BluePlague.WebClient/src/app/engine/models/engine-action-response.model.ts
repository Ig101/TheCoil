import { SceneChanges } from './scene/scene-changes.model';
import { EngineAction } from './engine-action.model';
import { ActionResult } from '../scene/models/action-result.model';

export interface EngineActionResponse {
    action: EngineAction;
    changes: SceneChanges;
    results: ActionResult[];
}
