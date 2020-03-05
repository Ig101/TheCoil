import { ActorSnapshot } from './objects/actor-snapshot.model';
import { TileSnapshot } from './tile-snapshot.model';

export interface SceneChanges {
    turn: number;
    changedActors: ActorSnapshot[];
    deletedActors: {id: number, x: number, y: number}[];
    changedTiles: TileSnapshot[];
    replacedTiles: TileSnapshot[];
    removedTiles: {x: number, y: number}[];
}
