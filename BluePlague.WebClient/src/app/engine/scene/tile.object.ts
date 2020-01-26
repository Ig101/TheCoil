import { Scene } from './scene.object';
import { Tag } from './models/tag.model';
import { Sprite } from './abstract/sprite.object';
import { TileNative } from '../models/natives/tile-native.model';
import { Actor } from './objects/actor.object';
import { EngineActionTypeEnum } from '../models/enums/engine-action-type.enum';
import { GameObject } from './objects/game-object.object';
import { TileSnapshot } from '../models/scene/tile-snapshot.model';
import { TileSavedData } from '../models/scene/tile-saved-data.model';

export class Tile {

    parent: Scene;
    objects: GameObject[];

    readonly x: number;
    readonly y: number;
    sprite: Sprite; // native
    readonly nativeId: string;
    readonly tags: Tag<Tile>[]; // native
    readonly passable: boolean; // native

    get snapshot(): TileSnapshot {
        return {
            x: this.x,
            y: this.y,
            sprite: this.sprite.snapshot,
            tags: this.tags,
            passable: this.passable
        } as TileSnapshot;
    }

    get savedData(): TileSavedData {
        return {
            x: this.x,
            y: this.y,
            nativeId: this.nativeId
        }
    }

    constructor(parent: Scene, tile: TileNative, x: number, y: number) {
        this.parent = parent;
        this.x = x;
        this.y = y;
        this.sprite = new Sprite(tile.sprite);
        this.nativeId = tile.id;
        this.passable = tile.passable;
        this.tags = tile.tags;
        this.objects = [];
    }

    react(action: EngineActionTypeEnum, impactTags?: string[], strength?: number) {
        const filteredTags = this.tags
            .filter(x => (!x.interactionTags || (impactTags && impactTags.find(tag => x.interactionTags.includes(tag)))));
        for (const tag of filteredTags) {
            const chosenReaction = tag.targetActionReactions[action];
            if (chosenReaction) {
                chosenReaction(this.parent, this, tag.weight, strength);
            }
        }
    }
}
