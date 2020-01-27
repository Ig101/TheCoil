import { GameObject } from './game-object.object';
import { EngineActionTypeEnum } from '../../models/enums/engine-action-type.enum';
import { Scene } from '../scene.object';
import { ActorNative } from '../../models/natives/actor-native.model';
import { Tile } from '../tile.object';
import { ActionTag } from '../models/action-tag.model';
import { ActorSnapshot } from '../../models/scene/objects/actor-snapshot.model';
import { ActorSavedData } from '../../models/scene/objects/actor-saved-data.model';
import { SpriteSnapshot } from '../../models/scene/abstract/sprite-snapshot.model';
import { EnginePlayerAction } from '../../models/engine-player-action.model';
import { ImpactTag } from '../models/impact-tag.model';
import { ActionResult } from '../models/action-result.model';
import { Tag } from '../models/tag.model';

export class Actor extends GameObject {
    readonly nativeId: string;
    readonly allowedActions: EngineActionTypeEnum[]; // native
    readonly speedModificator: number; // native
    readonly maxDurability: number; // native
    readonly maxEnergy: number; // native
    readonly tags: Tag<Actor>[]; // native
    readonly actionTags: ActionTag[];

    readonly passable: boolean; // native
    dead: boolean; // notSync

    durability: number;
    energy: number;
    remainedTurnTime: number;

    calculatedSpeedModification: number;
    calculatedMaxDurability: number;
    calculatedMaxEnergy: number;
    calculatedTags: Tag<Actor>[];
    calculatedActionTags: ActionTag[];
    calculatedAllowedActions: EngineActionTypeEnum[];

    get snapshot(): ActorSnapshot {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            sprite: this.sprite.snapshot,
            allowedActions: this.calculatedAllowedActions,
            speedModificator: this.calculatedSpeedModification,
            maxDurability: this.calculatedMaxDurability,
            maxEnergy: this.calculatedMaxEnergy,
            actionsTags: this.calculatedActionTags,
            tags: this.calculatedTags,
            passable: this.passable,
            durability: this.durability,
            energy: this.energy,
            remainedTurnTime: this.remainedTurnTime
        } as ActorSnapshot;
    }

    get savedData(): ActorSavedData {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            nativeId: this.nativeId,
            durability: this.durability,
            energy: this.energy,
            remainedTurnTime: this.remainedTurnTime
        } as ActorSavedData;
    }

    constructor(parent: Scene, id: number, native: ActorNative, x: number, y: number) {
        super(parent, id, native.sprite, x, y);
        this.nativeId = native.id;
        this.allowedActions = native.allowedActions;
        this.speedModificator = native.speedModificator;
        this.maxDurability = native.maxDurability;
        this.durability = this.maxDurability;
        this.maxEnergy = native.maxEnergy;
        this.energy = this.maxEnergy;
        this.tags = native.tags;
        this.actionTags = native.actionTags;
        this.passable = native.passable;
        this.dead = false;
        this.remainedTurnTime = 0;

        this.calculatedActionTags = this.actionTags;
        this.calculatedAllowedActions = this.calculatedAllowedActions;
        this.calculatedMaxDurability = this.calculatedMaxDurability;
        this.calculatedMaxEnergy = this.calculatedMaxEnergy;
        this.calculatedSpeedModification = this.calculatedSpeedModification;
        this.calculatedTags = this.calculatedTags;

        this.tile = parent.getTile(x, y);
        this.tile.objects.push(this);
    }

    // Technic
    changePosition(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.tile.objects.remove(this);
        this.tile = this.parent.getTile(x, y);
        this.tile.objects.push(this);
        this.parent.registedActorChange(this);
    }

    changePositionToTile(tile: Tile) {
        this.x = tile.x;
        this.y = tile.y;
        this.tile.objects.remove(this);
        this.tile = tile;
        this.tile.objects.push(this);
        this.parent.registedActorChange(this);
    }

    changeDurability(amount: number) {
        this.durability += amount;
        if (this.durability > this.calculatedMaxDurability) {
            this.durability = this.calculatedMaxDurability;
        } else if (this.durability <= 0) {
            this.dead = true;
        }
        this.parent.registedActorChange(this);
    }

    changeEnergy(amount: number) {
        this.energy += amount;
        if (this.energy > this.calculatedMaxEnergy) {
            this.energy = this.calculatedMaxEnergy;
        } else if (this.energy < 0) {
            this.energy = 0;
        }
        this.parent.registedActorChange(this);
    }

    // Actions
    update(time: number) {
        this.remainedTurnTime -= time;
    }

    reactOnOutgoingAction(action: EnginePlayerAction, impactTags?: ImpactTag[], strength?: number): ActionResult[] {
        const result = [];
        const tags = this.calculatedActionTags;
        for (const tag of tags) {
            let tagStrength = strength;
            if (tag.interactionTag) {
                const impactTag = impactTags.find(x => x.name === tag.interactionTag);
                if (!impactTag) {
                    continue;
                }
                tagStrength = impactTag.strength;
            }
            const chosenReaction = tag.reactions[action.type];
            if (chosenReaction) {
                const reaction = chosenReaction.action(this.parent, this, action.x, action.y, tag.weight, tagStrength);
                this.remainedTurnTime += reaction.time;
                result.push(reaction);
            }
        }
        return result;
    }

    validateAction(action: EnginePlayerAction, impactTags?: ImpactTag[]): boolean {
        if (!this.allowedActions.includes(action.type)) {
            return false;
        }
        const tags = this.calculatedActionTags;
        for (const tag of tags) {
            if (tag.interactionTag) {
                if (!impactTags || !impactTags.find(x => x.name === tag.interactionTag)) {
                    continue;
                }
            }
            const chosenReaction = tag.reactions[action.type];
            if (chosenReaction && chosenReaction.validator) {
                if (!chosenReaction.validator(this.parent, this, action.x, action.y)) {
                    return false;
                }
            }
        }
        return true;
    }

    act(action: EnginePlayerAction): ActionResult[] {
        // TODO Spells and another with strength and outcoming
        const actions = this.reactOnOutgoingAction(action);
        if (actions.length === 0) {
            this.remainedTurnTime += this.calculatedSpeedModification;
            actions.push({
                time: this.calculatedSpeedModification,
                message: ['default-nothing-happens']
            } as ActionResult);
        }
        const reactionTile = this.parent.getTile(action.x, action.y);
        actions.push(...reactionTile.react(action.type, this));
        for (const object of reactionTile.objects) {
            if (object !== this) {
                actions.push(...object.react(action.type, this));
            }
        }
        return actions;
    }
}
