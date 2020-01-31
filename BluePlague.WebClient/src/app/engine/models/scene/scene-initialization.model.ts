import { ActorInitialization } from './objects/actor-initialization.model';
import { TileInitialization } from './tile-initialization.model';

export interface SceneInitialization {
    global: boolean;
    scale: number;
    turn: number;
    tiles: TileInitialization[];
    width: number;
    height: number;
}

