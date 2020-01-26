import { SpriteSnapshot } from '../abstract/sprite-snapshot.model';

export interface GameObjectSnapshot {
    id: number;
    x: number;
    y: number;
    sprite: SpriteSnapshot;
}
