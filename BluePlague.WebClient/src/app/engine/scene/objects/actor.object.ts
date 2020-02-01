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
import { ActionValidationResult } from '../models/action-validation-result.model';
import { IReactiveObject } from '../interfaces/reactive-object.interface';

export class Actor extends GameObject implements IActiveObject {
    readonly nativeId: string;
    readonly speedModification: number; // native
    readonly weight: number; // native
    readonly maxDurability: number; // native
    readonly maxEnergy: number; // native
    readonly tags: ActionTag<Actor>[]; // native
    readonly actions: ActorAction[]; // native

    readonly passable: boolean; // native
    dead = false;

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
            player: this.parent.playerId === this.id,
            id: this.id,
            x: this.x,
            y: this.y,
            name: this.name,
            nativeId: this.nativeId,
            durability: this.durability,
            energy: this.energy,
            remainedTurnTime: this.remainedTurnTime
        } as ActorSavedData;
    }

    constructor(parent: Scene, id: number, native: ActorNative, x: number, y: number, name?: string) {
        super(parent, id, native.sprite, x, y, name ? name : native.name);
        this.nativeId = native.id;
        this.speedModification = native.speedModificator;
        this.maxDurability = native.maxDurability;
        this.weight = native.weight;
        this.durability = this.maxDurability;
        this.maxEnergy = native.maxEnergy;
        this.energy = this.maxEnergy;
        this.tags = native.tags;
        this.actions = native.actions;
        this.passable = native.passable;
        this.remainedTurnTime = 0;

        this.calculatedWeight = this.weight;
        this.calculatedActions = this.actions;
        this.calculatedMaxDurability = this.maxDurability;
        this.calculatedMaxEnergy = this.maxEnergy;
        this.calculatedSpeedModification = this.speedModification;
        this.calculatedTags = this.tags;

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
        this.parent.registerActorChange(this);
    }

    changePositionToTile(tile: Tile) {
        this.x = tile.x;
        this.y = tile.y;
        this.tile.objects.remove(this);
        this.tile = tile;
        this.tile.objects.push(this);
        this.parent.registerActorChange(this);
    }

    changeDurability(amount: number) {
        this.durability += amount;
        if (this.durability > this.calculatedMaxDurability) {
            this.durability = this.calculatedMaxDurability;
        } else if (this.durability <= 0) {
            this.dead = true;
            this.tile.objects.remove(this);
            this.parent.pushDead(this);
        }
        this.parent.registerActorChange(this);
    }

    changeEnergy(amount: number) {
        this.energy += amount;
        if (this.energy > this.calculatedMaxEnergy) {
            this.energy = this.calculatedMaxEnergy;
        } else if (this.energy < 0) {
            this.energy = 0;
        }
        this.parent.registerActorChange(this);
    }

    // Actions
    update(time: number) {
        this.remainedTurnTime -= time;
    }

    validateAction(action: EnginePlayerAction, deep: boolean = true): ActionValidationResult {
        const chosenAction = this.actions[action.type];
        if (!chosenAction) {
            return {
                success: false
            };
        }
        let validationResult: ActionValidationResult;
        if (chosenAction.validator) {
            validationResult = chosenAction.validator(this.parent, this, action.x, action.y, action.extraIdentifier, deep);
        } else {
            validationResult = {
                success: true
            };
        }
        const tags = this.calculatedTags;
        for (const tag of tags) {
            const chosenReaction = tag.outgoingReactions[action.type];
            if (chosenReaction && chosenReaction.validator) {
                if (!chosenReaction.validator(this.parent, this, action.x, action.y)) {
                    validationResult.success = false;
                    return validationResult;
                }
            }
        }
        return validationResult;
    }

    act(action: EnginePlayerAction): number {
        const actionInfo = this.doAction(action);
        this.remainedTurnTime += actionInfo.result.time;
        this.reactOnOutgoingAction(action.type, actionInfo.result.time, actionInfo.result.strength);
        this.doReactiveAction(action.type, actionInfo.group, actionInfo.result.reaction,
                              actionInfo.result.reachedObjects, actionInfo.result.time, actionInfo.result.strength);
        return actionInfo.result.time;
    }


    reactOnOutgoingAction(action: string, time: number, strength?: number) {
        const tags = this.calculatedTags;
        for (const tag of tags) {
            const chosenReaction = tag.outgoingReactions[action];
            if (chosenReaction) {
                const reaction = chosenReaction.reaction(this.parent, this, chosenReaction.weight, strength);
                this.doReactiveAction(reaction.type, reaction.group, reaction.reaction, reaction.reachedObjects, time, reaction.strength);
            }
        }
    }

    private doAction(action: EnginePlayerAction): {group: string, result: ActorActionResult} {
        const chosenAction = this.calculatedActions.find(x => x.name === action.type);
        if (!chosenAction) {
            return undefined;
        }
        const result = chosenAction.action(this.parent, this, action.x, action.y, action.extraIdentifier);
        this.parent.finishAction(result.reaction, action.type, this.x, this.y, this.id);
        if (chosenAction.group === 'move') {
            result.time *= this.parent.moveSpeedModifier;
        }
        return { group: chosenAction.group, result };
    }
}
