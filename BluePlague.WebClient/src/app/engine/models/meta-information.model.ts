import { RoomTypeEnum } from './enums/room-type.enum';

export interface MetaInformation {
    // Codes enemies of room
    difficulty: number;
    roomType: RoomTypeEnum;
    // Codes position of room
    dungeon: string;
    depth: number;
    // Codes extra info of room
    name: string;
    seed?: number; // If null, room is creating without random
}
