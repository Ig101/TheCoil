import { MetaInformation } from './meta-information.model';
import { SceneSavedData } from './scene/scene-saved-data.model';

export interface EngineSnapshot {
    meta: MetaInformation;
    scene?: SceneSavedData;
}
