import { Scene } from '../scene.object';
import { Sprite } from '../abstract/sprite.object';
import { SpriteNative } from '../../models/natives/sprite-native.model';
import { Tile } from '../tile.object';
import { Actor } from './actor.object';
import { Tag } from '../models/tag.model';
import { IReactiveObject } from '../interfaces/reactive-object.interface';
import { ReactionResult } from '../models/reaction-result.model';

export abstract class GameObject implements IReactiveObject {

    tile: Tile;

    parent: Scene;

    id: number;
    x: number;
    y: number;
    name: string;
    sprite: Sprite; // native

    constructor(parent: Scene, id: number, sprite: SpriteNative, x: number, y: number, name: string) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.id = id;
        this.parent = parent;
        this.sprite = new Sprite(sprite);
    }

    abstract get tags(): Tag<unknown>[];

    react(action: string, initiator: Actor, time: number, strength?: number): ReactionResult[] {
        const result = [];
        const tags = this.tags;
        for (const tag of tags) {
            const chosenReaction = tag.reactions[action];
            if (chosenReaction) {
                result.push(chosenReaction.reaction(this.parent, this, initiator, time, chosenReaction.weight, strength));
            }
        }
        return result;
    }

}
