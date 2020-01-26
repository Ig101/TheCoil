import { GameObject } from './game-object.object';
import { EngineActionTypeEnum } from '../../models/enums/engine-action-type.enum';
import { Scene } from '../scene.object';
import { ActorNative } from '../../models/natives/actor-native.model';
import { Tile } from '../tile.object';
import { ActorTag } from '../models/actor-tag.model';
import { ActorSnapshot } from '../../models/scene/objects/actor-snapshot.model';
import { ActorSavedData } from '../../models/scene/objects/actor-saved-data.model';
import { SpriteSnapshot } from '../../models/scene/abstract/sprite-snapshot.model';

export class Actor extends GameObject {

    readonly nativeId: string;
    readonly allowedActions: EngineActionTypeEnum[]; // native
    readonly speedModificator: number; // native
    readonly maxDurability: number; // native
    readonly maxEnergy: number; // native
    readonly tags: ActorTag[]; // native

    readonly passable: boolean; // native
    dead: boolean; // notSync

    durability: number;
    energy: number;
    remainedTurnTime: number;

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


    get calculatedSpeedModification() {
        return this.speedModificator;
    }

    get calculatedMaxDurability() {
        return this.maxDurability;
    }

    get calculatedMaxEnergy() {
        return this.maxEnergy;
    }

    get calculatedTags() {
        return this.tags;
    }

    get calculatedAllowedActions() {
        return this.allowedActions;
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
        this.passable = native.passable;
        this.dead = false;
        this.remainedTurnTime = 0;
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

    reactOnTarget(action: EngineActionTypeEnum, impactTags?: string[], strength?: number) {
        const filteredTags = this.calculatedTags
            .filter(x => (!x.interactionTags || (impactTags && impactTags.find(tag => x.interactionTags.includes(tag)))));
        for (const tag of filteredTags) {
            const chosenReaction = tag.targetActionReactions[action];
            if (chosenReaction) {
                chosenReaction(this.parent, this, tag.weight, strength);
            }
        }
    }

    reactOnSelf(action: EngineActionTypeEnum, impactTags?: string[], strength?: number) {
        const filteredTags = this.calculatedTags
            .filter(x => (!x.interactionTags || (impactTags && impactTags.find(tag => x.interactionTags.includes(tag)))));
        for (const tag of filteredTags) {
            const chosenReaction = tag.selfActionReactions[action];
            if (chosenReaction) {
                chosenReaction(this.parent, this, tag.weight, strength);
            }
        }
    }

    checkMoveActionAvailability(xShift: number, yShift: number): boolean {
        if (this.remainedTurnTime > 0 || xShift > 1 || yShift > 1 || xShift < -1 || yShift < -1) {
            return false;
        }
        const tile = this.parent.getTile(this.x + xShift, this.y + yShift);
        if (!tile.passable || tile.objects.filter(x => (x instanceof Actor && !x.passable)).length > 0) {
            return false;
        }
        return true;
    }

    moveAction(xShift: number, yShift: number): number {
        const timeShift = this.calculatedSpeedModification;
        this.remainedTurnTime += timeShift;
        const tile = this.parent.getTile(this.x + xShift, this.y + yShift);
        this.changePositionToTile(tile);
        this.tile.react(EngineActionTypeEnum.Move, null, null);
        this.reactOnSelf(EngineActionTypeEnum.Move, null, null);
        return timeShift;
    }

    waitAction(): number {
        let timeShift = 0;
        if (this.parent.playerId === this.id) {
            timeShift = this.calculatedSpeedModification;
            this.remainedTurnTime += this.calculatedSpeedModification;
        } else {
            while (this.remainedTurnTime < 0) {
                this.remainedTurnTime += this.calculatedSpeedModification;
                timeShift += this.calculatedSpeedModification;
            }
        }
        this.tile.react(EngineActionTypeEnum.Wait, null, null);
        this.reactOnSelf(EngineActionTypeEnum.Wait, null, null);
        return timeShift;
    }

    dieAction(): number {
        this.tile.react(EngineActionTypeEnum.Die, null, null);
        this.reactOnSelf(EngineActionTypeEnum.Die, null, null);
        return 0;
    }
}
