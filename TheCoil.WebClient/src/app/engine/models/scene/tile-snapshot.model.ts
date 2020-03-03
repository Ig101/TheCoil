import { Tag } from '../../scene/models/tag.model';
import { Tile } from '../../scene/tile.object';
import { ActorSnapshot } from './objects/actor-snapshot.model';
import { VisualizationSnapshot } from './abstract/visualization-snapshot.model';

export interface TileSnapshot {
    x: number;
    y: number;
    name: string;
    sprite: VisualizationSnapshot;
    backgroundColor: {r: number, g: number, b: number};
    bright: boolean;
    tags: Tag<Tile>[];
    passable: boolean;
    viewable: boolean;
    objects: ActorSnapshot[];
}
