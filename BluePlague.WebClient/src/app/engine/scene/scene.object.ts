import { Tile } from './tile.object';
import { SceneInitialization } from '../models/scene/scene-initialization.model';
import { SceneSnapshot } from '../models/scene/scene-snapshot.model';
import { Actor } from './objects/actor.object';
import { SceneChanges } from '../models/scene/scene-changes.model';
import { EnginePlayerAction } from '../models/engine-player-action.model';
import { EngineActionTypeEnum } from '../models/enums/engine-action-type.enum';
import { EngineActionResponse } from '../models/engine-action-response.model';
import { SceneSavedData } from '../models/scene/scene-saved-data.model';
import { EngineAction } from '../models/engine-action.model';

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
            changedActors: this.changedActors.map(x => x.savedData),
            deletedActors: this.deletedActors,
            changedTiles: this.changedTiles.map(x => x.savedData)
        } as SceneSavedData;
    }

    constructor(initialization: SceneInitialization) {
        throw new Error('Method not implemented.');
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
        if (!this.player.calculatedAllowedActions.includes(action.type)) {
            return null;
        }
        switch (action.type) {
            case EngineActionTypeEnum.Move:
                const xShift = action.x - this.player.x;
                const yShift = action.y - this.player.y;
                if (xShift === 0 && yShift === 0) {
                    action.type = EngineActionTypeEnum.Wait;
                    return [action];
                }
                // TODO A* in future
                if (!this.player.checkMoveActionAvailability(xShift, yShift)) {
                    return null;
                }
                return [action];
            default:
                return [action];
        }
    }

    playerAct(action: EnginePlayerAction): EngineActionResponse[] {
        let timeShift = 0;
        switch (action.type) {
            case EngineActionTypeEnum.Move:
                timeShift = this.player.moveAction(action.x - this.player.x, action.y - this.player.y);
                break;
            case EngineActionTypeEnum.Wait:
                timeShift = this.player.waitAction();
                break;
        }
        const response = {
            action: {
                actorId: this.player.id,
                type: action.type,
                extraIdentifier: action.extraIdentifier,
                x: action.x,
                y: action.y
            } as EngineAction,
            changes: this.getSessionChages()
        } as EngineActionResponse;
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
                actor.dieAction();
                this.registerActorDeath(actor);
                deaths.push({
                    action: {
                        actorId: actor.id,
                        type: EngineActionTypeEnum.Die,
                        extraIdentifier: undefined,
                        x: actor.x,
                        y: actor.y
                    } as EngineAction,
                    changes: this.getSessionChages()
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
                actor.waitAction();
                responses.push({
                    action: {
                        actorId: actor.id,
                        type: EngineActionTypeEnum.Wait,
                        extraIdentifier: undefined,
                        x: actor.x,
                        y: actor.y
                    } as EngineAction,
                    changes: this.getSessionChages()
                } as EngineActionResponse);
            }
        }
        responses.push(...this.gatherCorpses());
        return responses;
    }

    private getSessionChages(): SceneChanges {
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
