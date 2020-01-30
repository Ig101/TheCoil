import { TileSnapshot } from './tile-snapshot.model';
import { ActorSnapshot } from './objects/actor-snapshot.model';

export interface SceneSnapshot {
    global: boolean;
    playerId: number;
    turn: number;
    width: number;
    height: number;
    actors: ActorSnapshot[];
    tiles: TileSnapshot[][];
}
