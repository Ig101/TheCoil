import { Scene } from './scene.object';
import { Tag } from './models/tag.model';
import { Sprite } from './abstract/sprite.object';
import { TileNative } from '../models/natives/tile-native.model';
import { Actor } from './objects/actor.object';
import { EngineActionTypeEnum } from '../models/enums/engine-action-type.enum';
import { GameObject } from './objects/game-object.object';
import { TileSnapshot } from '../models/scene/tile-snapshot.model';
import { TileSavedData } from '../models/scene/tile-saved-data.model';
import { ImpactTag } from './models/impact-tag.model';
import { IReactiveObject } from './interfaces/reactive-object.interface';
import { ActionResult } from './models/action-result.model';

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

    get snapshot(): TileSnapshot {
        return {
            x: this.x,
            y: this.y,
            sprite: this.sprite.snapshot,
            backgroundColor: this.backgroundColor,
            tags: this.tags,
            passable: this.passable
        } as TileSnapshot;
    }

    get savedData(): TileSavedData {
        return {
            x: this.x,
            y: this.y,
            nativeId: this.nativeId
        };
    }

    constructor(parent: Scene, tile: TileNative, x: number, y: number) {
        this.parent = parent;
        this.x = x;
        this.y = y;
        this.sprite = new Sprite(tile.sprite);
        this.nativeId = tile.id;
        this.passable = tile.passable;
        this.tags = tile.tags;
        this.backgroundColor = tile.backgroundColor;
        this.objects = [];
    }

    react(action: EngineActionTypeEnum, initiator: Actor, impactTags?: ImpactTag[], strength?: number): ActionResult[] {
        const result = [];
        const tags = this.tags;
        for (const tag of tags) {
            let tagStrength = strength;
            if (tag.interactionTag) {
                const impactTag = impactTags.find(x => x.name === tag.interactionTag);
                if (!impactTag) {
                    continue;
                }
                tagStrength = impactTag.strength;
            }
            const chosenReaction = tag.targetActionReactions[action];
            if (chosenReaction) {
                result.push({
                    time: 0,
                    message: chosenReaction.action(this.parent, this, initiator, tag.weight, tagStrength)
                });
            }
        }
        return result;
    }
}
