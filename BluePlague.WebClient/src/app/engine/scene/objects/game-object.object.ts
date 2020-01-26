import { Scene } from '../scene.object';
import { Sprite } from '../abstract/sprite.object';
import { SpriteNative } from '../../models/natives/sprite-native.model';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Tile } from '../tile.object';

export class GameObject {

    tile: Tile;

    parent: Scene;

    id: number;
    x: number;
    y: number;
    sprite: Sprite; // native

    constructor(parent: Scene, id: number, sprite: SpriteNative, x: number, y: number) {
        this.x = x;
        this.y = y;
        this.id = id;
        this.parent = parent;
        this.sprite = new Sprite(sprite);
    }

}
