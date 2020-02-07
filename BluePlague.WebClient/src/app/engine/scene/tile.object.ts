import { Scene } from './scene.object';
import { Tag } from './models/tag.model';
import { Sprite } from './abstract/sprite.object';
import { TileNative } from '../models/natives/tile-native.model';
import { Actor } from './objects/actor.object';
import { TileSnapshot } from '../models/scene/tile-snapshot.model';
import { TileSavedData } from '../models/scene/tile-saved-data.model';
import { IReactiveObject } from './interfaces/reactive-object.interface';
import { ActionValidationResult } from './models/action-validation-result.model';
import { ReactionResult } from './models/reaction-result.model';
import { AnotherLevelLink } from './models/another-level-link.model';

export class Tile implements IReactiveObject {

    parent: Scene;
    objects: Actor[];

    readonly x: number;
    readonly y: number;
    sprite: Sprite; // native
    name: string; // native
    backgroundColor: {r: number, g: number, b: number}; // native
    bright: boolean;
    readonly nativeId: string;
    readonly tags: Tag<Tile>[]; // native
    readonly passable: boolean; // native
    levelLink?: AnotherLevelLink;

    get snapshot(): TileSnapshot {
        return {
            x: this.x,
            y: this.y,
            sprite: this.sprite ? this.sprite.snapshot : undefined,
            name: this.name,
            backgroundColor: this.backgroundColor,
            bright: this.bright,
            tags: this.tags,
            passable: this.passable,
            levelLink: this.levelLink,
            objects: this.objects.map(x => x.snapshot)
        } as TileSnapshot;
    }

    get lightSnapshot(): TileSnapshot {
        return {
            x: this.x,
            y: this.y,
            sprite: this.sprite ? this.sprite.snapshot : undefined,
            name: this.name,
            backgroundColor: this.backgroundColor,
            bright: this.bright,
            tags: this.tags,
            passable: this.passable,
            levelLink: this.levelLink
        } as TileSnapshot;
    }

    get savedData(): TileSavedData {
        return {
            x: this.x,
            y: this.y,
            nativeId: this.nativeId,
            levelLink: this.levelLink
        };
    }

    constructor(parent: Scene, tile: TileNative, x: number, y: number, link?: AnotherLevelLink) {
        this.parent = parent;
        this.x = x;
        this.y = y;
        this.sprite = tile.sprite ? new Sprite(tile.sprite) : undefined;
        this.bright = tile.bright;
        this.nativeId = tile.id;
        this.passable = tile.passable;
        this.tags = tile.tags;
        this.name = tile.name;
        this.backgroundColor = tile.backgroundColor;
        this.objects = [];
        this.levelLink = link;
    }

    react(reaction: string, initiator: Actor, time: number, strength?: number) {
        const tags = this.tags;
        for (const tag of tags) {
            const chosenReaction = tag.reactions[reaction];
            if (chosenReaction) {
                const result = chosenReaction.reaction(this.parent, this, initiator, time, chosenReaction.weight, strength);
                if (result) {
                    this.doReactiveAction(result.animation, result.reaction, result.result,
                        result.reachedObjects, time, result.strength);
                    if (result.strength) {
                        strength = result.strength;
                    }
                }
            }
        }
    }

    doReactiveAction(animation: string, reaction: string, result: ReactionResult,
                     reachedObjects: IReactiveObject[], time: number, strength: number = 1) {
        this.parent.finishAction(result, animation, this.x, this.y, reachedObjects);
        for (const object of reachedObjects) {
            object.react(reaction, this, time, strength);
        }
    }
}
