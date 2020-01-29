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
import { DefaultActionEnum } from '../models/enums/default-action.enum';
import { ActionParsingResult } from './models/action-parsing-result.model';
import { Subject } from 'rxjs';
import { ReactionResult } from './models/reaction-result.model';
export class Scene {

    private resoponseSubject = new Subject<EngineActionResponse>();
    private unsubscribeSubject = new Subject();

    private changedActors: Actor[] = [];
    private deletedActors: number[] = [];
    private changedTiles: Tile[] = [];

    private sessionChangedActors: Actor[] = [];
    private sessionDeletedActors: number[] = [];
    private sessionChangedTiles: Tile[] = [];

    private corpsesPool: Actor[] = [];

    private player: Actor;
    private turn: number;

    private idIncrementor = 0;

    private actors: Actor[];
    private tiles: Tile[][];

    readonly width: number;
    readonly height: number;

    get playerId() {
        return this.player.id;
    }

    get snapshot(): SceneSnapshot {
        return {
            playerId: this.playerId,
            turn: this.turn,
            width: this.width,
            height: this.height,
            actors: this.actors.map(x => x.snapshot),
            tiles: this.tiles.map(x => x.map(y => y.snapshot))
        } as SceneSnapshot;
    }

    get savedData(): SceneSavedData {
        return {
            turn: this.turn,
            idIncrementor: this.idIncrementor,
            changedActors: this.changedActors.map(x => x.savedData),
            deletedActors: this.deletedActors,
            changedTiles: this.changedTiles.map(x => x.savedData)
        } as SceneSavedData;
    }

    constructor(
        initialization: SceneInitialization,
        savedData: SceneSavedData,
        private nativeService: NativeService
    ) {
        this.turn = initialization.turn;
        this.width = initialization.width;
        this.height = initialization.height;
        this.tiles = new Array(this.width);
        for (let x = 0; x < this.width; x++) {
            this.tiles[x] = new Array(this.height);
        }
        for (const tile of initialization.tiles) {
            if (savedData) {
                const savedTile = savedData.changedTiles.find(x => x.x === tile.x && x.y === tile.y);
                if (savedTile) {
                    const newTile = new Tile(this,
                        this.nativeService.getTile(savedTile.nativeId), tile.x, tile.y);
                    this.tiles[tile.x][tile.y] = newTile;
                    this.changedTiles.push(newTile);
                    continue;
                }
            }
            this.tiles[tile.x][tile.y] = new Tile(this,
                tile.native, tile.x, tile.y);
        }
        for (const actor of initialization.actors) {
            if (savedData) {
                if (savedData.deletedActors.includes(this.idIncrementor)) {
                    this.idIncrementor++;
                    continue;
                }
                const savedActor = savedData.changedActors.find(x => x.id === this.idIncrementor);
                if (savedActor) {
                    const newActor = this.createActor(this.nativeService.getActor(savedActor.nativeId), savedActor.x, savedActor.y);
                    this.changedActors.push(newActor);
                    newActor.durability = savedActor.durability;
                    newActor.energy = savedActor.energy;
                    newActor.remainedTurnTime = savedActor.remainedTurnTime;
                    continue;
                }
            }
            this.createActor(actor.native, actor.x, actor.y);
        }
        if (savedData) {
            for (const actor of savedData.changedActors) {
                if (!this.actors.find(x => x.id === actor.id)) {
                    const newActor = this.createActor(this.nativeService.getActor(actor.nativeId), actor.x, actor.y);
                    this.changedActors.push(newActor);
                    newActor.id = actor.id;
                }
            }
            this.deletedActors = savedData.deletedActors;
            this.idIncrementor = savedData.idIncrementor;
        }
    }

    subscribe(next: (value: EngineActionResponse) => void, unsubscription?: (value: unknown) => void) {
        if (unsubscription) {
            this.unsubscribeSubject.subscribe(unsubscription);
        }
        return this.resoponseSubject.subscribe(next);
    }

    unsubscribe() {
        this.unsubscribeSubject.next();
        this.unsubscribeSubject.unsubscribe();
        this.resoponseSubject.unsubscribe();
    }

    // Creation
    createActor(native: ActorNative, x: number, y: number): Actor {
        const id = this.idIncrementor;
        this.idIncrementor++;
        const actor = new Actor(this, id, native, x, y);
        this.actors.push(actor);
        return actor;
    }

    // ChangesRegistration
    pushDead(actor: Actor) {
        this.corpsesPool.push(actor);
    }

    registedActorChange(actor: Actor) {
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
    parsePlayerAction(action: EnginePlayerAction): ActionParsingResult {
        switch (action.type) {
            default:
                const availability = this.player.validateAction(action);
                return {
                    success: availability.success,
                    extraValues: availability.extraValues,
                    actions: [action]
                };
        }
    }

    parseAllPlayerActions(x: number, y: number): { [action: number]: ActionParsingResult; } {
        const dictionary: { [action: number]: ActionParsingResult; } = {};
        for (const action of Object.values(this.player.actions)) {
            dictionary[action.name] = this.parsePlayerAction({
                type: action.name,
                x,
                y
            } as EnginePlayerAction);
        }
        return dictionary;
    }

    playerAct(action: EnginePlayerAction) {
        const playerActions = this.player.act(action);
        const timeShift = playerActions.time;
        this.finishAction(this.player.id, playerActions.reactions, action.type, action.x, action.y, action.extraIdentifier);
        if (timeShift === 0) {
            return;
        }
        this.turn += timeShift;
        this.actionReaction(action, timeShift);
    }

    private finishAction(actorId: number, reactions: ReactionResult[], type: string, x: number, y: number, extraIdentifier?: number) {
        this.resoponseSubject.next({
            action: {
                actorId,
                type,
                extraIdentifier,
                x,
                y
            } as EngineAction,
            changes: this.getSessionChanges(),
            results: reactions
        });
        for (const corpse of this.corpsesPool) {
            const result = corpse.act({
                type: DefaultActionEnum.Die,
                x: corpse.x,
                y: corpse.y
            } as EnginePlayerAction);
            this.registerActorDeath(corpse);
            this.resoponseSubject.next({
                action: {
                    actorId: corpse.id,
                    type: DefaultActionEnum.Die,
                    extraIdentifier: undefined,
                    x: corpse.x,
                    y: corpse.y
                } as EngineAction,
                changes: this.getSessionChanges(),
                results: result.reactions
            } as EngineActionResponse);
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
                    const result = actor.act({
                        type: DefaultActionEnum.Wait,
                        x: actor.x,
                        y: actor.y
                    } as EnginePlayerAction);
                    this.finishAction(actor.id, result.reactions, DefaultActionEnum.Wait, actor.x, actor.y);
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
