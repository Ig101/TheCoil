import { TileSavedData } from './tile-saved-data.model';
import { ActorSavedData } from './objects/actor-saved-data.model';

export interface TileStorage extends TileSavedData {
  objects: ActorSavedData[];
}
