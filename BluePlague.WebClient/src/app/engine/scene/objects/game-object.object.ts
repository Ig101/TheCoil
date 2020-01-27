import { Scene } from '../scene.object';
import { Sprite } from '../abstract/sprite.object';
import { SpriteNative } from '../../models/natives/sprite-native.model';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Tile } from '../tile.object';
import { EngineActionTypeEnum } from '../../models/enums/engine-action-type.enum';
import { Actor } from './actor.object';
import { ImpactTag } from '../models/impact-tag.model';
import { Tag } from '../models/tag.model';
import { IReactiveObject } from '../interfaces/reactive-object.interface';

export abstract class GameObject implements IReactiveObject {

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

    abstract get tags(): Tag<unknown>[];

    react(action: EngineActionTypeEnum, initiator: Actor, impactTags?: ImpactTag[], strength?: number) {
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
                chosenReaction(this.parent, this, initiator, tag.weight, tagStrength);
            }
        }
    }

}
