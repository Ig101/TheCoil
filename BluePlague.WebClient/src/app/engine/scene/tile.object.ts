import { Scene } from './scene.object';
import { Tag } from './models/tag.model';
import { TileNative } from '../models/natives/tile-native.model';
import { Actor } from './objects/actor.object';
import { TileSnapshot } from '../models/scene/tile-snapshot.model';
import { TileSavedData } from '../models/scene/tile-saved-data.model';
import { IReactiveObject } from './interfaces/reactive-object.interface';
import { ActionValidationResult } from './models/action-validation-result.model';
import { ReactionResult } from './models/reaction-result.model';
import { AnotherLevelLink } from './models/another-level-link.model';
import { VisualizationSnapshot } from '../models/scene/abstract/visualization-snapshot.model';

export class Tile implements IReactiveObject {

    parent: Scene;
    objects: Actor[];

    readonly x: number;
    readonly y: number;
    readonly native: TileNative;
    levelLink?: AnotherLevelLink;

    get snapshot(): TileSnapshot {
        return {
            x: this.x,
            y: this.y,
            sprite: this.native.sprite ? this.native.sprite as VisualizationSnapshot : undefined,
            name: this.native.name,
            backgroundColor: this.native.backgroundColor,
            bright: this.native.bright,
            tags: this.native.tags,
            passable: this.native.passable,
            levelLink: this.levelLink,
            objects: this.objects.map(x => x.snapshot)
        } as TileSnapshot;
    }

    get lightSnapshot(): TileSnapshot {
        return {
            x: this.x,
            y: this.y,
            sprite: this.native.sprite ? this.native.sprite as VisualizationSnapshot : undefined,
            name: this.native.name,
            backgroundColor: this.native.backgroundColor,
            bright: this.native.bright,
            tags: this.native.tags,
            passable: this.native.passable,
            levelLink: this.levelLink
        } as TileSnapshot;
    }

    get savedData(): TileSavedData {
        return {
            x: this.x,
            y: this.y,
            nativeId: this.native.id,
            levelLink: this.levelLink
        };
    }

    constructor(parent: Scene, tile: TileNative, x: number, y: number, link?: AnotherLevelLink) {
        this.parent = parent;
        this.x = x;
        this.y = y;
        this.native = tile;
        this.objects = [];
        this.levelLink = link;
    }

    react(reaction: string, initiator: Actor, time: number, strength?: number) {
        const tags = this.native.tags;
        for (const tag of tags) {
            const chosenReaction = tag.reactions[reaction];
            if (chosenReaction) {
                const result = chosenReaction.reaction(this.parent, this, initiator, time, chosenReaction.weight, strength);
                if (result) {
                    this.doReactiveAction(result.animation, result.reaction, result.result,
                        result.reachedObjects, time, result.strength, result.range);
                    if (result.strength) {
                        strength = result.strength;
                    }
                }
            }
        }
    }

    doReactiveAction(animation: string, reaction: string, result: ReactionResult,
                     reachedObjects: IReactiveObject[], time: number, strength: number = 1, range?: number) {
        this.parent.finishAction(result, animation, this.x, this.y, reachedObjects, false, range);
        for (const object of reachedObjects) {
            object.react(reaction, this, time, strength);
        }
    }
}
