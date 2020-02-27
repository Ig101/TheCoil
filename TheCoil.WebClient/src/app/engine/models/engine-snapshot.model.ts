import { MetaInformation } from './meta-information.model';
import { SceneSavedData } from './scene/scene-saved-data.model';

export interface EngineSnapshot {
    needRefresh: boolean;
    meta: MetaInformation;
    scene: SceneSavedData;
}
