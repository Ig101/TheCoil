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

    abstract set remainedTurnTime(value: number);

    abstract reactOnOutgoingAction(action: string, strength?: number);

    react(action: string, initiator: Actor, time: number, strength?: number) {
        const tags = this.tags;
        for (const tag of tags) {
            const chosenReaction = tag.reactions[action];
            if (chosenReaction) {
                chosenReaction.reaction(this.parent, this, initiator, time, chosenReaction.weight, strength);
            }
        }
    }

    doReactiveAction(type: string, reaction: ReactionResult,
                     reachedObjects: IReactiveObject[], time: number, strength: number = 1) {
        this.parent.finishAction(reaction, type, this.id);
        for (const object of reachedObjects) {
            object.react(type, this, time, strength);
        }
    }

}
