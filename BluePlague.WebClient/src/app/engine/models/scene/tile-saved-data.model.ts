import { AnotherLevelLink } from '../../scene/models/another-level-link.model';

export interface TileSavedData {
    x: number;
    y: number;
    nativeId: string;
    levelLink?: AnotherLevelLink;
}
