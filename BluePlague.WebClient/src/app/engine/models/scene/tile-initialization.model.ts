import { TileNative } from '../natives/tile-native.model';

export interface TileInitialization {
    readonly x: number;
    readonly y: number;
    readonly native: TileNative;
}
