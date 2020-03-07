import { SpriteNative } from './sprite-native.model';
import { Tag } from '../../scene/models/tag.model';
import { Tile } from '../../scene/tile.object';
export interface TileNative {
    id: string;
    name: string;
    sprite: SpriteNative;
    backgroundColor: {r: number, g: number, b: number};
    bright: boolean;
    tags: Tag<Tile>[];
    passable: boolean;
    viewable: boolean;
}
