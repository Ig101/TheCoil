import { GameObject } from './game-object.object';
import { Scene } from '../scene.object';
import { ActorNative } from '../../models/natives/actor-native.model';
import { Tile } from '../tile.object';
import { ActionTag } from '../models/action-tag.model';
import { ActorSnapshot } from '../../models/scene/objects/actor-snapshot.model';
import { ActorSavedData } from '../../models/scene/objects/actor-saved-data.model';
import { SpriteSnapshot } from '../../models/scene/abstract/sprite-snapshot.model';
import { EnginePlayerAction } from '../../models/engine-player-action.model';
import { Tag } from '../models/tag.model';
import { ActorAction } from '../models/actor-action.model';
import { ReactionResult } from '../models/reaction-result.model';
import { ActorActionResult } from '../models/actor-action-result.model';
import { IActiveObject } from '../interfaces/active-object.interface';

export class Actor extends GameObject implements IActiveObject {
    readonly nativeId: string;
    readonly speedModificator: number; // native
    readonly weight: number; // native
    readonly maxDurability: number; // native
    readonly maxEnergy: number; // native
    readonly tags: ActionTag<Actor>[]; // native
    readonly actions: ActorAction[]; // native

    readonly passable: boolean; // native
    dead: boolean; // notSync

    durability: number;
    energy: number;
    remainedTurnTime: number;

    calculatedSpeedModification: number;
    calculatedMaxDurability: number;
    calculatedWeight: number;
    calculatedMaxEnergy: number;
    calculatedTags: ActionTag<Actor>[];
    calculatedActions: ActorAction[];

    get snapshot(): ActorSnapshot {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            weight: this.calculatedWeight,
            sprite: this.sprite.snapshot,
            speedModificator: this.calculatedSpeedModification,
            maxDurability: this.calculatedMaxDurability,
            maxEnergy: this.calculatedMaxEnergy,
            actions: this.calculatedActions,
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

    constructor(parent: Scene, id: number, native: ActorNative, x: number, y: number, name?: string) {
        super(parent, id, native.sprite, x, y, name ? name : native.name);
        this.nativeId = native.id;
        this.speedModificator = native.speedModificator;
        this.maxDurability = native.maxDurability;
        this.weight = native.weight;
        this.durability = this.maxDurability;
        this.maxEnergy = native.maxEnergy;
        this.energy = this.maxEnergy;
        this.tags = native.tags;
        this.actions = native.actions;
        this.passable = native.passable;
        this.dead = false;
        this.remainedTurnTime = 0;

        this.calculatedWeight = this.weight;
        this.calculatedActions = this.actions;
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

    validateAction(action: EnginePlayerAction, searchByGroup: boolean): boolean {
        const chosenAction = searchByGroup ?
        this.calculatedActions.find(x => x.group === action.type) :
        this.calculatedActions.find(x => x.name === action.type);
        if (!chosenAction ||
            (chosenAction.validator && !chosenAction.validator(this.parent, this, action.x, action.y, action.extraIdentifier))) {
            return false;
        }
        const tags = this.calculatedTags;
        for (const tag of tags) {
            const chosenReaction = tag.outgoingReactions[action.type];
            if (chosenReaction && chosenReaction.validator) {
                if (!chosenReaction.validator(this.parent, this, action.x, action.y)) {
                    return false;
                }
            }
        }
        return true;
    }

    act(action: EnginePlayerAction, searchByGroup: boolean): ActorActionResult {
        const actionInfo = this.doAction(action, searchByGroup);
        const actionResult = actionInfo.result;
        const reactionResults = this.reactOnOutgoingAction(actionInfo.group, action.x, action.y);
        const timeShift = reactionResults.reduce((sum, o) => sum + o.time, 0) + actionResult.time;
        for (const object of actionResult.reachedObjects) {
            reactionResults.push({
                time: 0,
                message: object.react(actionInfo.group, this, timeShift, actionResult.strength)
            });
        }
        actionResult.reactions.concat(reactionResults);
        actionResult.time += timeShift;
        return actionResult;
    }

    private reactOnOutgoingAction(action: string, x: number, y: number, strength?: number): ReactionResult[] {
        const result = [];
        const tags = this.calculatedTags;
        for (const tag of tags) {
            const chosenReaction = tag.outgoingReactions[action];
            if (chosenReaction) {
                const reaction = chosenReaction.reaction(this.parent, this, x, y, chosenReaction.weight, strength);
                this.remainedTurnTime += reaction.time;
                result.push(reaction);
            }
        }
        return result;
    }

    private doAction(action: EnginePlayerAction, searchByGroup: boolean): {group: string, result: ActorActionResult} {
        const chosenAction = searchByGroup ?
            this.calculatedActions.find(x => x.group === action.type) :
            this.calculatedActions.find(x => x.name === action.type);
        if (!chosenAction) {
            return undefined;
        }
        const result = chosenAction.action(this.parent, this, action.x, action.y, action.extraIdentifier);
        this.remainedTurnTime += result.time;
        return { group: chosenAction.group, result };
    }
}
