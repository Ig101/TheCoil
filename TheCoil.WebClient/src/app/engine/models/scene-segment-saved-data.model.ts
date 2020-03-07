import { ActorSavedData } from './scene/objects/actor-saved-data.model';
import { TileSavedData } from './scene/tile-saved-data.model';
import { RoomTypeEnum } from './enums/room-type.enum';

export interface SceneSegmentSavedData {
  seed: number;
  roomType: RoomTypeEnum;
  difficulty: number;
  lastSaveTurn: number;
  actors: ActorSavedData[];
  tiles: TileSavedData[];
  id: number;
  nextId: number;
}
