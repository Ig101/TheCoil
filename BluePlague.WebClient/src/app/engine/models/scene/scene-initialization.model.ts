import { ActorInitialization } from './objects/actor-initialization.model';
import { TileInitialization } from './tile-initialization.model';

export interface SceneInitialization {
    turn: number;
    playerActor: ActorInitialization;
    actors: ActorInitialization[];
    tiles: TileInitialization[][];
}

