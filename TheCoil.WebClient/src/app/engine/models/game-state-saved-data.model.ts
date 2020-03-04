import { SceneSegmentSavedData } from './scene-segment-saved-data.model';
import { MetaInformation } from './meta-information.model';
import { UnsettledActorSavedData } from './scene/objects/unsettled-actor-saved-data.model';
import { PlayerSavedData } from './player-saved-data.model';

export interface GameStateSavedData {
  needRefresh: boolean;
  sceneSegments: SceneSegmentSavedData[];
  unsettledActors: UnsettledActorSavedData[];
}
