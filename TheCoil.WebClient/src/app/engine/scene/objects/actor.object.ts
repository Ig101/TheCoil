import { Scene } from '../scene.object';
import { ActorNative } from '../../models/natives/actor-native.model';
import { Tile } from '../tile.object';
import { ActionTag } from '../models/action-tag.model';
import { ActorSnapshot } from '../../models/scene/objects/actor-snapshot.model';
import { ActorSavedData } from '../../models/scene/objects/actor-saved-data.model';
import { EnginePlayerAction } from '../../models/engine-player-action.model';
import { Tag } from '../models/tag.model';
import { ActorAction } from '../models/actor-action.model';
import { ReactionResult } from '../models/reaction-result.model';
import { ActorActionResult } from '../models/actor-action-result.model';
import { IActiveObject } from '../interfaces/active-object.interface';
import { ActionValidationResult } from '../models/action-validation-result.model';
import { IReactiveObject } from '../interfaces/reactive-object.interface';
import { ActionValidationResultFull } from '../models/action-validation-result-full.model';
import { EnginePlayerActionFull } from '../../models/engine-player-action-full.model';
import { removeFromArray } from 'src/app/helpers/extensions/array.extension';
import { ReactionMessageLevelEnum } from '../../models/enums/reaction-message-level.enum';
import { VisualizationSnapshot } from '../../models/scene/abstract/visualization-snapshot.model';
import { Visualization } from '../abstract/visualization.object';

export class Actor implements IActiveObject {

    tile: Tile;

    parent: Scene;

    id: number;
    x: number;
    y: number;
    name: string;

    readonly native: ActorNative;
    readonly visualization: Visualization;

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
            name: this.name,
            weight: this.calculatedWeight,
            sprite: this.visualization.snapshot,
            speedModificator: this.calculatedSpeedModification,
            maxDurability: this.calculatedMaxDurability,
            maxEnergy: this.calculatedMaxEnergy,
            actions: this.calculatedActions,
            tags: this.calculatedTags,
            passable: this.native.passable,
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
            name: this.name,
            nativeId: this.native.id,
            durability: this.durability,
            energy: this.energy,
            remainedTurnTime: this.remainedTurnTime
        } as ActorSavedData;
    }

    constructor(parent: Scene, id: number, native: ActorNative, tile: Tile, name?: string) {
        this.name = name ? name : native.name;
        this.x = tile.x;
        this.y = tile.y;
        this.id = id;
        this.parent = parent;
        this.native = native;
        this.remainedTurnTime = 0;

        this.calculatedWeight = this.native.weight;
        this.calculatedActions = this.native.actions;
        this.calculatedMaxDurability = this.native.maxDurability;
        this.calculatedMaxEnergy = this.native.maxEnergy;
        this.calculatedSpeedModification = this.native.speedModificator;
        this.calculatedTags = this.native.tags.sort((a, b) => a.priority - b.priority);
        this.visualization = new Visualization(native.sprite);

        this.durability = this.calculatedMaxDurability;
        this.energy = this.calculatedMaxEnergy;

        this.tile = tile;
        this.tile.objects.push(this);
    }

    // Technic
    changePosition(x: number, y: number) {
        const oldX = this.x;
        const oldY = this.y;
        this.x = x;
        this.y = y;
        removeFromArray(this.tile.objects, this);
        this.tile = this.parent.getTile(x, y);
        this.tile.objects.push(this);
        this.parent.registerActorPositionChange(oldX, oldY, this);
        if (this.parent.playerId === this.id) {
            this.parent.registerPlayerPositionChange();
        }
    }

    changePositionToTile(tile: Tile) {
        const oldX = this.x;
        const oldY = this.y;
        this.x = tile.x;
        this.y = tile.y;
        removeFromArray(this.tile.objects, this);
        this.tile = tile;
        this.tile.objects.push(this);
        this.parent.registerActorPositionChange(oldX, oldY, this);
        if (this.parent.playerId === this.id) {
            this.parent.registerPlayerPositionChange();
        }
    }

    changeDurability(amount: number) {
        this.durability += amount;
        if (this.durability > this.calculatedMaxDurability) {
            this.durability = this.calculatedMaxDurability;
        } else if (this.durability <= 0) {
            this.dead = true;
            removeFromArray(this.tile.objects, this);
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

    validateAction(action: EnginePlayerAction, deep: boolean = true): ActionValidationResultFull {
        const chosenAction = this.calculatedActions.find(x => x.id === action.id);
        if (!chosenAction) {
            return {
                success: false,
                action: undefined
            };
        }
        let validationResult: ActionValidationResultFull;
        const fullAction = {
            id: action.id,
            extraIdentifier: action.extraIdentifier,
            x: action.x,
            y: action.y,
            name: chosenAction.name,
            character: chosenAction.character,
            reaction: chosenAction.reaction,
            animation: chosenAction.animation
        } as EnginePlayerActionFull;
        if (!this.parent.getTile(action.x, action.y)) {
            return {
                success: false,
                action: fullAction
            };
        }
        if (chosenAction.validator) {
            validationResult =
                chosenAction.validator(this.parent, this, action.x, action.y, deep, action.extraIdentifier) as ActionValidationResultFull;
            validationResult.action = fullAction;
        } else {
            validationResult = {
                success: true,
                action: fullAction
            };
        }
        const tags = this.calculatedTags;
        for (const tag of tags) {
            const chosenReaction = tag.outgoingReactions[action.id];
            if (chosenReaction && chosenReaction.validator) {
                const result = chosenReaction.validator(this.parent, this, action.x, action.y);
                if (result) {
                    validationResult.success = false;
                    validationResult.reason = result;
                    return validationResult;
                }
            }
        }
        return validationResult;
    }

    act(action: EnginePlayerAction): number {
        const actionInfo = this.doAction(action);
        this.remainedTurnTime += actionInfo.time;
        this.reactOnOutgoingAction(actionInfo.name, actionInfo.time, actionInfo.strength);
        for (const object of actionInfo.reachedObjects) {
            object.react(actionInfo.reaction, this, actionInfo.time, actionInfo.strength);
        }
        return actionInfo.time;
    }


    reactOnOutgoingAction(action: string, time: number, strength?: number) {
        const tags = this.calculatedTags;
        for (const tag of tags) {
            const chosenReaction = tag.outgoingReactions[action];
            if (chosenReaction) {
                const result = chosenReaction.reaction(this.parent, this, chosenReaction.weight, strength);
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

    isActionImportant(name: string): boolean {
        switch (name) {
            default:
                return false;
        }
    }

    private doAction(action: EnginePlayerAction): ActorActionResult {
        const chosenAction = this.calculatedActions.find(x => x.id === action.id);
        if (!chosenAction) {
            return undefined;
        }
        const result = chosenAction.action(this.parent, this, action.x, action.y, action.extraIdentifier);
        if (!result.animation) {
            result.animation = chosenAction.animation;
        }
        if (!result.reaction) {
            result.reaction = chosenAction.reaction;
        }
        if (!result.name) {
            result.name = chosenAction.id;
        }
        this.parent.finishAction(result.result, result.animation, this.x, this.y, result.reachedObjects,
            this.isActionImportant(action.id), result.range, action.extraIdentifier, result.actor);
        return result;
    }

    // Reactions
    react(reaction: string, initiator: Actor, time: number, strength?: number) {
        const tags = this.calculatedTags;
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

    doReactiveActionOnDeath() {
        const reachedObjects = [this.tile, ...this.tile.objects];
        this.parent.finishAction(                    {
            level: ReactionMessageLevelEnum.Information,
            message: $localize`:@@game.reaction.action.die:${this.name}:name: is dead.`
        } as ReactionResult, 'die', this.x, this.y, reachedObjects, true, undefined, undefined, this);
        this.reactOnOutgoingAction('die', 0);
        for (const object of reachedObjects) {
            object.react('die', this, 0);
        }
    }

    doReactiveAction(animation: string, reaction: string, result: ReactionResult,
                     reachedObjects: IReactiveObject[], time: number, strength: number = 1, range?: number) {
        this.parent.finishAction(result, animation, this.x, this.y, reachedObjects, false, range, undefined, this);
        for (const object of reachedObjects) {
            object.react(reaction, this, time, strength);
        }
    }
}
