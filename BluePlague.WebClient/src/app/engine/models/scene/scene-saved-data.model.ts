import { ActorSavedData } from './objects/actor-saved-data.model';
import { TileSavedData } from './tile-saved-data.model';

export interface SceneSavedData {
    turn: number;
    changedActors: ActorSavedData[];
    deletedActors: number[];
    changedTiles: TileSavedData[];
}
