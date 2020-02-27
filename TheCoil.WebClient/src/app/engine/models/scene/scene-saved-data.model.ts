import { ActorSavedData } from './objects/actor-saved-data.model';
import { TileSavedData } from './tile-saved-data.model';
import { UnsettledActorSavedData } from './objects/unsettled-actor-saved-data.model';

export interface SceneSavedData {
    turn: number;
    idIncrementor?: number;
    changedActors: ActorSavedData[];
    changedTiles: TileSavedData[];
    unsettledActors: UnsettledActorSavedData[];
}
