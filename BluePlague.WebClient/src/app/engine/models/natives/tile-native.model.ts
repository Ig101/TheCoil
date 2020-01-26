import { SpriteNative } from './sprite-native.model';
import { Tag } from '../../scene/models/tag.model';
import { Tile } from '../../scene/tile.object';

export interface TileNative {
    id: string;
    sprite: SpriteNative;
    tags: Tag<Tile>[];
    passable: boolean;
}
