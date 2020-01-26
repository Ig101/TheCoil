import { SpriteNative } from '../../models/natives/sprite-native.model';
import { SpriteSnapshot } from '../../models/scene/abstract/sprite-snapshot.model';

export class Sprite {
    character: string;
    color: {r: number, g: number, b: number, a: number};

    get calculatedColor() {
        return this.color;
    }

    get snapshot(): SpriteSnapshot {
        return {
            character: this.character,
            color: this.calculatedColor
        } as SpriteSnapshot;
    }

    constructor(native: SpriteNative) {
        this.character = native.character;
        this.color = native.color;
    }
}
