import { SpriteNative } from './sprite-native.model';
import { Tag } from '../../scene/models/tag.model';
import { Tile } from '../../scene/tile.object';
import { AnotherLevelLink } from '../../scene/models/another-level-link.model';

export interface TileNative {
    id: string;
    sprite: SpriteNative;
    backgroundColor: {r: number, g: number, b: number, a: number};
    tags: Tag<Tile>[];
    passable: boolean;
}
