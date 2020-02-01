import { SpriteSnapshot } from './abstract/sprite-snapshot.model';
import { Tag } from '../../scene/models/tag.model';
import { Tile } from '../../scene/tile.object';
import { AnotherLevelLink } from '../../scene/models/another-level-link.model';
import { ActorSnapshot } from './objects/actor-snapshot.model';

export interface TileSnapshot {
    x: number;
    y: number;
    name: string;
    sprite: SpriteSnapshot;
    backgroundColor: {r: number, g: number, b: number};
    bright: boolean;
    tags: Tag<Tile>[];
    passable: boolean;
    levelLink?: AnotherLevelLink;
    objects: ActorSnapshot[];
}
