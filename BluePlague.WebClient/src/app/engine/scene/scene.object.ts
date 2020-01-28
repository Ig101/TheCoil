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
export class Scene {

    private changedActors: Actor[] = [];
    private deletedActors: number[] = [];
    private changedTiles: Tile[] = [];

    private sessionChangedActors: Actor[] = [];
    private sessionDeletedActors: number[] = [];
    private sessionChangedTiles: Tile[] = [];

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

    // Creation
    createActor(native: ActorNative, x: number, y: number): Actor {
        const id = this.idIncrementor;
        this.idIncrementor++;
        const actor = new Actor(this, id, native, x, y);
        this.actors.push(actor);
        return actor;
    }

    // ChangesRegistration
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
    }

    registedTileChange(tile: Tile) {
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
    parsePlayerAction(action: EnginePlayerAction): EnginePlayerAction[] {
        switch (action.type) {
            default:
                const availability = this.player.validateAction(action);
                if (availability) {
                    return [action];
                }
        }
    }

    parseAllPlayerActions(x: number, y: number): { [action: number]: EnginePlayerAction[]; } {
        const dictionary: { [action: number]: EnginePlayerAction[]; } = {};
        for (const action of Object.values(this.player.actions)) {
            dictionary[action.name] = this.parsePlayerAction({
                type: action.name,
                x,
                y
            } as EnginePlayerAction);
        }
        return dictionary;
    }

    playerAct(action: EnginePlayerAction): EngineActionResponse[] {
        const playerActions = this.player.act(action);
        const timeShift = playerActions.time;
        const response = {
            action: {
                actorId: this.player.id,
                type: action.type,
                extraIdentifier: action.extraIdentifier,
                x: action.x,
                y: action.y
            } as EngineAction,
            changes: this.getSessionChanges(),
            results: playerActions.reactions
        } as EngineActionResponse;
        if (timeShift === 0) {
            return [response];
        }
        this.turn += timeShift;
        const reactions = this.actionReaction(action, timeShift);
        return [response, ...reactions];
    }

    private gatherCorpses(): EngineActionResponse[] {
        const deaths: EngineActionResponse[] = [];
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.actors.length; i++) {
            const actor = this.actors[i];
            if (actor.dead) {
                const results = actor.act({
                    type: DefaultActionEnum.Die,
                    x: actor.x,
                    y: actor.y
                } as EnginePlayerAction);
                this.registerActorDeath(actor);
                deaths.push({
                    action: {
                        actorId: actor.id,
                        type: DefaultActionEnum.Die,
                        extraIdentifier: undefined,
                        x: actor.x,
                        y: actor.y
                    } as EngineAction,
                    changes: this.getSessionChanges(),
                    results: results.reactions
                } as EngineActionResponse);
                this.actors.splice(i, 1);
                i--;
            }
        }
        return deaths;
    }

    private actionReaction(action: EnginePlayerAction, time: number): EngineActionResponse[] {
        const responses: EngineActionResponse[] = [];
        if (time <= 0) {
            return [];
        }
        // TODO AI
        for (const actor of this.actors) {
            actor.update(time);
            if (actor !== this.player) {
                const results = [];
                while (actor.remainedTurnTime <= 0) {
                    results.push(actor.act({
                        type: DefaultActionEnum.Wait,
                        x: actor.x,
                        y: actor.y
                    } as EnginePlayerAction));
                }
                responses.push({
                    action: {
                        actorId: actor.id,
                        type: DefaultActionEnum.Wait,
                        extraIdentifier: undefined,
                        x: actor.x,
                        y: actor.y
                    } as EngineAction,
                    changes: this.getSessionChanges(),
                    results
                } as EngineActionResponse);
            }
        }
        responses.push(...this.gatherCorpses());
        return responses;
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
