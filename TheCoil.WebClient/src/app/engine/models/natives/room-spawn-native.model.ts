import { RoomTypeEnum } from 'src/app/engine/models/enums/room-type.enum';

export interface RoomSpawnNative {
    roomTypes: RoomTypeEnum[];
    minDifficulty: number;
    maxDifficulty: number;
    actorId: string;
}
