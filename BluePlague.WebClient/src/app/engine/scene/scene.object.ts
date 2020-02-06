import { Tile } from './tile.object';
import { SceneInitialization } from '../models/scene/scene-initialization.model';
import { SceneSnapshot } from '../models/scene/scene-snapshot.model';
import { Actor } from './objects/actor.object';
import { SceneChanges } from '../models/scene/scene-changes.model';
import { EnginePlayerAction } from '../models/engine-player-action.model';
import { EngineActionResponse } from '../models/engine-action-response.model';
import { SceneSavedData } from '../models/scene/scene-saved-data.model';
import { EngineAction } from '../models/engine-action.model';
import { NativeService } from '../services/native.service';
import { ActorNative } from '../models/natives/actor-native.model';
import { Subject } from 'rxjs';
import { ReactionResult } from './models/reaction-result.model';
import { UnsettledActorSavedData } from '../models/scene/objects/unsettled-actor-saved-data.model';
import { ReactionMessageLevelEnum } from '../models/enums/reaction-message-level.enum';
import { ActionValidationResultFull } from './models/action-validation-result-full.model';
import { removeFromArray } from 'src/app/helpers/extensions/array.extension';
import { actorSmartValidation } from '../tag-actions/actor-smart-action.actions';
import { ActionValidationResult } from './models/action-validation-result.model';
export class Scene {

    private global = false;
    private scale = 1;
    private responseSubject = new Subject<EngineActionResponse>();

    private changedActors: Actor[] = [];
    private deletedActors: number[] = [];
    private changedTiles: Tile[] = [];
    private unsettledActors: UnsettledActorSavedData[] = [];

    private sessionChangedActors: Actor[] = [];
    private sessionDeletedActors: {id: number, x: number, y: number}[] = [];
    private sessionChangedTiles: Tile[] = [];

    private corpsesPool: Actor[] = [];

    private player: Actor;
    private turn: number;

    private idIncrementor = 0;

    private actors: Actor[] = [];
    private tiles: Tile[][];

    private gatheringCorpsesStarted = false;

    readonly width: number;
    readonly height: number;

    get playerId() {
        return this.player.id;
    }

    get moveSpeedModifier() {
        return this.scale;
    }

    get snapshot(): SceneSnapshot {
        return {
            global: this.global,
            player: this.player.snapshot,
            turn: this.turn,
            width: this.width,
            height: this.height,
            tiles: this.tiles.map(x => x.map(y => y.snapshot))
        } as SceneSnapshot;
    }

    get savedData(): SceneSavedData {
        return {
            turn: this.turn,
            idIncrementor: this.idIncrementor,
            changedActors: this.changedActors.map(x => x.savedData),
            deletedActors: this.deletedActors,
            changedTiles: this.changedTiles.map(x => x.savedData),
            unsettledActors: this.unsettledActors
        } as SceneSavedData;
    }

    constructor(
        initialization: SceneInitialization,
        savedData: SceneSavedData,
        private nativeService: NativeService
    ) {
        this.global = initialization.global;
        this.scale = initialization.scale;
        this.turn = savedData.turn;
        this.width = initialization.width;
        this.height = initialization.height;
        this.tiles = new Array(this.width);
        for (let x = 0; x < this.width; x++) {
            this.tiles[x] = new Array(this.height);
        }
        for (const tile of initialization.tiles) {
            const savedTile = savedData.changedTiles.find(x => x.x === tile.x && x.y === tile.y);
            if (savedTile) {
                const newTile = new Tile(this,
                    this.nativeService.getTile(savedTile.nativeId), tile.x, tile.y);
                this.tiles[tile.x][tile.y] = newTile;
                this.changedTiles.push(newTile);
                continue;
            }
            this.tiles[tile.x][tile.y] = new Tile(this,
                tile.native, tile.x, tile.y);
        }
        for (const actor of savedData.changedActors) {
            const newActor = this.createActor(this.nativeService.getActor(actor.nativeId), actor.x, actor.y, actor.name, false);
            this.changedActors.push(newActor);
            newActor.id = actor.id;
            newActor.durability = actor.durability;
            newActor.energy = actor.energy;
            newActor.remainedTurnTime = actor.remainedTurnTime;
            if (actor.player) {
                this.player = newActor;
            }
        }
        this.deletedActors = savedData.deletedActors;
        if (savedData.idIncrementor) {
            this.idIncrementor = savedData.idIncrementor;
        }
        this.pushUnsettledActors(savedData.unsettledActors);
    }

    subscribe(next: (value: EngineActionResponse) => void) {
        return this.responseSubject.subscribe(next);
    }

    unsubscribe() {
        this.responseSubject.unsubscribe();
    }

    // Creation
    createActor(native: ActorNative, x: number, y: number, name?: string, newActor: boolean = true): Actor {
        const id = this.idIncrementor;
        this.idIncrementor++;
        const actor = new Actor(this, id, native, x, y, name);
        this.actors.push(actor);
        if (newActor) {
            this.registerActorChange(actor);
        }
        return actor;
    }

    // ChangesRegistration
    pushUnsettledActors(actors: UnsettledActorSavedData[]) {
        for (const actor of actors) {
            if (!this.global || actor.player) {

            }
            // TODO SetupUnsettledActors
        }
    }

    pushDead(actor: Actor) {
        this.corpsesPool.push(actor);
    }

    registerActorPositionChange(oldX: number, oldY: number, actor: Actor) {
        if (!this.changedActors.includes(actor)) {
            this.changedActors.push(actor);
        }
        if (!this.sessionChangedActors.includes(actor)) {
            this.sessionChangedActors.push(actor);
        }
        this.sessionDeletedActors.push({
            id: actor.id,
            x: oldX,
            y: oldY
        });
    }

    registerActorChange(actor: Actor) {
        if (!this.changedActors.includes(actor)) {
            this.changedActors.push(actor);
        }
        if (!this.sessionChangedActors.includes(actor)) {
            this.sessionChangedActors.push(actor);
        }
    }

    registerActorDeath(actor: Actor) {
        if (!this.deletedActors.includes(actor.id)) {
            removeFromArray(this.changedActors, actor);
            this.deletedActors.push(actor.id);
        }
        if (!this.sessionDeletedActors.find(x => x.id === actor.id)) {
            this.sessionDeletedActors.push({
                id: actor.id,
                x: actor.x,
                y: actor.y
            });
        }
        if (this.sessionChangedActors.includes(actor)) {
            removeFromArray(this.sessionChangedActors, actor);
        }
        removeFromArray(this.actors, actor);
    }

    registerTileChange(tile: Tile) {
        if (!this.changedTiles.includes(tile)) {
            this.changedTiles.push(tile);
        }
        if (!this.sessionChangedTiles.includes(tile)) {
            this.sessionChangedTiles.push(tile);
        }
    }

    // Technic
    getActor(id: number) {
        return this.actors[id];
    }

    getObjectsByTile(x: number, y: number) {
        return this.tiles[x][y].objects;
    }

    getTile(x: number, y: number) {
        return this.tiles[x][y];
    }

    // Actions

    // if null, action is restricted
    parsePlayerAction(action: EnginePlayerAction, deep: boolean = true): ActionValidationResultFull {
        const availability = this.player.validateAction(action, deep);
        return availability;
    }

    parseAllPlayerActions(x: number, y: number): ActionValidationResultFull[] {
        const dictionary: ActionValidationResultFull[] = [];
        for (const action of this.player.actions) {
            dictionary.push(this.parsePlayerAction({
                type: action.name,
                x,
                y
            }, false));
        }
        return dictionary;
    }

    parsePlayerSmartAction(x: number, y: number): ActionValidationResult {
        return actorSmartValidation(this, this.player, x, y);
    }

    playerAct(action: EnginePlayerAction, unsettledActors: UnsettledActorSavedData[]) {
        const timeShift = this.player.act(action);
        if (timeShift === 0) {
            return;
        }
        this.turn += timeShift;
        this.actionReaction(action, timeShift);
        this.pushUnsettledActors(unsettledActors);
    }

    finishAction(reaction: ReactionResult, type: string, x: number, y: number, extraIdentifier?: number, actorId?: number) {
        this.responseSubject.next({
            actorId,
            type,
            x,
            y,
            extraIdentifier,
            changes: this.getSessionChanges(),
            result: reaction
        });
        if (!this.gatheringCorpsesStarted) {
            this.gatheringCorpsesStarted = true;
            while (this.corpsesPool.length > 0) {
                const corpse = this.corpsesPool.pop();
                this.registerActorDeath(corpse);
                corpse.doReactiveAction(
                    'die',
                    'die',
                    {
                        level: ReactionMessageLevelEnum.Information,
                        message: [corpse.name, 'is dead.']
                    } as ReactionResult,
                    [ corpse.tile, ...corpse.tile.objects ],
                    0
                );
            }
            this.gatheringCorpsesStarted = false;
        }
    }

    private getActorsForAction() {
        return this.actors.sort((a, b) => (a.calculatedSpeedModification + a.remainedTurnTime) -
            (b.calculatedSpeedModification + b.remainedTurnTime));
    }

    private actionReaction(action: EnginePlayerAction, time: number) {
        // TODO AI
        const sortedActors = this.getActorsForAction();
        for (const actor of sortedActors) {
            actor.update(time);
            if (actor !== this.player) {
                while (actor.remainedTurnTime <= 0) {
                    actor.act({
                        type: 'wait',
                        x: actor.x,
                        y: actor.y
                    } as EnginePlayerAction);
                }
            }
        }
    }

    private getSessionChanges(): SceneChanges {
        const result = {
            turn: this.turn,
            changedActors: this.sessionChangedActors.map(x => x.snapshot),
            deletedActors: this.sessionDeletedActors,
            changedTiles: this.sessionChangedTiles.map(x => x.lightSnapshot)
        };
        this.sessionChangedActors.length = 0;
        this.sessionDeletedActors = [];
        this.sessionChangedTiles.length = 0;
        return result;
    }
}
