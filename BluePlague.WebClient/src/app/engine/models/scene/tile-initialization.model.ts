import { TileNative } from '../natives/tile-native.model';
import { AnotherLevelLink } from '../../scene/models/another-level-link.model';

export interface TileInitialization {
    x: number;
    y: number;
    native: TileNative;
    levelLink?: AnotherLevelLink;
}
