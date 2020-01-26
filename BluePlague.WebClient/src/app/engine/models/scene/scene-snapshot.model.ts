import { TileSnapshot } from './tile-snapshot.model';
import { ActorSnapshot } from './objects/actor-snapshot.model';

export interface SceneSnapshot {
    playerId: number;
    turn: number;
    idIncrementor: number;
    actors: ActorSnapshot[];
    tiles: TileSnapshot[][];
}
