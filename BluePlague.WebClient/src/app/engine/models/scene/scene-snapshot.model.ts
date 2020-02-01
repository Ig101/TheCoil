import { TileSnapshot } from './tile-snapshot.model';
import { ActorSnapshot } from './objects/actor-snapshot.model';

export interface SceneSnapshot {
    global: boolean;
    player: ActorSnapshot;
    turn: number;
    width: number;
    height: number;
    tiles: TileSnapshot[][];
}
