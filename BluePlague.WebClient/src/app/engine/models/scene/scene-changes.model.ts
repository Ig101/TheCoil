import { ActorSnapshot } from './objects/actor-snapshot.model';
import { TileSnapshot } from './tile-snapshot.model';

export interface SceneChanges {
    turn: number;
    changedActors: ActorSnapshot[];
    deletedActors: number[];
    changedTiles: TileSnapshot[];
}
