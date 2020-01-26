import { GameObjectSnapshot } from './objects/game-object-snapshot.model';
import { SpriteSnapshot } from './abstract/sprite-snapshot.model';
import { Tag } from '../../scene/models/tag.model';
import { Tile } from '../../scene/tile.object';

export interface TileSnapshot {
    x: number;
    y: number;
    sprite: SpriteSnapshot;
    backgroundColor: {r: number, g: number, b: number, a: number};
    tags: Tag<Tile>[];
    passable: boolean;
}
