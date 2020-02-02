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
import { ActionParsingResult } from './models/action-parsing-result.model';
import { Subject } from 'rxjs';
import { ReactionResult } from './models/reaction-result.model';
import { UnsettledActorSavedData } from '../models/scene/objects/unsettled-actor-saved-data.model';
import { ReactionMessageLevelEnum } from '../models/enums/reaction-message-level.enum';
export class Scene {

    private global = false;
    private scale = 1;
    private resoponseSubject = new Subject<EngineActionResponse>();

    private changedActors: Actor[] = [];
    private deletedActors: number[] = [];
    private changedTiles: Tile[] = [];
    private unsettledActors: UnsettledActorSavedData[] = [];

    private sessionChangedActors: Actor[] = [];
    private sessionDeletedActors: number[] = [];
    private sessionChangedTiles: Tile[] = [];

    private corpsesPool: Actor[] = [];

    private player: Actor;
    private turn: number;

    private idIncrementor = 0;

    private actors: Actor[] = [];
    private tiles: Tile[][];

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
            const newActor = this.createActor(this.nativeService.getActor(actor.nativeId), actor.x, actor.y, false);
            this.changedActors.push(newActor);
            newActor.id = actor.id;
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
        return this.resoponseSubject.subscribe(next);
    }

    unsubscribe() {
        this.resoponseSubject.unsubscribe();
    }

    // Creation
    createActor(native: ActorNative, x: number, y: number, newActor: boolean = true): Actor {
        const id = this.idIncrementor;
        this.idIncrementor++;
        const actor = new Actor(this, id, native, x, y);
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
            this.deletedActors.push(actor.id);
        }
        if (!this.sessionDeletedActors.includes(actor.id)) {
            this.sessionDeletedActors.push(actor.id);
        }
        this.actors.remove(actor);
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
    parsePlayerAction(action: EnginePlayerAction, deep: boolean = true): ActionParsingResult {
        const availability = this.player.validateAction(action, deep);
        return {
            success: availability.success,
            extraValues: availability.extraValues,
            warning: availability.warning,
            reason: availability.reason,
            action
        };
    }

    parseAllPlayerActions(x: number, y: number): ActionParsingResult[] {
        const dictionary: ActionParsingResult[] = [];
        for (const action of this.player.actions) {
            dictionary.push(this.parsePlayerAction({
                type: action.name,
                x,
                y
            }, false));
        }
        return dictionary;
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

    finishAction(reaction: ReactionResult, type: string, x: number, y: number, actorId?: number) {
        this.resoponseSubject.next({
            actorId,
            type,
            x,
            y,
            changes: this.getSessionChanges(),
            result: reaction
        });
        for (const corpse of this.corpsesPool) {
            corpse.doReactiveAction(
                'die',
                'die',
                {
                    level: ReactionMessageLevelEnum.Information,
                    message: [corpse.name, ' died.']
                } as ReactionResult,
                [ corpse.tile, ...corpse.tile.objects ],
                0
            );
            this.registerActorDeath(corpse);
        }
        this.corpsesPool.length = 0;
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
            changedTiles: this.sessionChangedTiles.map(x => x.snapshot)
        };
        this.sessionChangedActors.length = 0;
        this.sessionDeletedActors.length = 0;
        this.sessionChangedTiles.length = 0;
        return result;
    }
}
