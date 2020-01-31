import { Scene } from './scene.object';
import { Tag } from './models/tag.model';
import { Sprite } from './abstract/sprite.object';
import { TileNative } from '../models/natives/tile-native.model';
import { Actor } from './objects/actor.object';
import { GameObject } from './objects/game-object.object';
import { TileSnapshot } from '../models/scene/tile-snapshot.model';
import { TileSavedData } from '../models/scene/tile-saved-data.model';
import { IReactiveObject } from './interfaces/reactive-object.interface';
import { ActionValidationResult } from './models/action-validation-result.model';
import { ReactionResult } from './models/reaction-result.model';
import { AnotherLevelLink } from './models/another-level-link.model';

export class Tile implements IReactiveObject {

    parent: Scene;
    objects: GameObject[];

    readonly x: number;
    readonly y: number;
    sprite: Sprite; // native
    backgroundColor: {r: number, g: number, b: number, a: number}; // native
    readonly nativeId: string;
    readonly tags: Tag<Tile>[]; // native
    readonly passable: boolean; // native
    levelLink?: AnotherLevelLink;

    get snapshot(): TileSnapshot {
        return {
            x: this.x,
            y: this.y,
            sprite: this.sprite.snapshot,
            backgroundColor: this.backgroundColor,
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
        this.sprite = new Sprite(tile.sprite);
        this.nativeId = tile.id;
        this.passable = tile.passable;
        this.tags = tile.tags;
        this.backgroundColor = tile.backgroundColor;
        this.objects = [];
        this.levelLink = link;
    }

    react(action: string, initiator: Actor, time: number, strength?: number) {
        const tags = this.tags;
        for (const tag of tags) {
            const chosenReaction = tag.reactions[action];
            if (chosenReaction) {
                const reaction = chosenReaction.reaction(this.parent, this, initiator, time, chosenReaction.weight, strength);
                this.doReactiveAction(reaction.type, reaction.group, reaction.reaction, reaction.reachedObjects, time, reaction.strength);
            }
        }
    }

    doReactiveAction(type: string, group: string, reaction: ReactionResult,
                     reachedObjects: IReactiveObject[], time: number, strength: number = 1) {
        this.parent.finishAction(reaction, type, this.x, this.y);
        for (const object of reachedObjects) {
            object.react(group, this, time, strength);
        }
    }
}
