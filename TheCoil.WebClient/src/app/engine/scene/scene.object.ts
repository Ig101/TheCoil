import { Tile } from './tile.object';
import { SceneSnapshot } from '../models/scene/scene-snapshot.model';
import { Actor } from './objects/actor.object';
import { SceneChanges } from '../models/scene/scene-changes.model';
import { EnginePlayerAction } from '../models/engine-player-action.model';
import { EngineActionResponse } from '../models/engine-action-response.model';
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
import { IReactiveObject } from './interfaces/reactive-object.interface';
import { SceneSegment } from './scene-segment.object';
import { PlayerSavedData } from '../models/player-saved-data.model';
import { SceneSegmentInformation } from '../models/scene/scene-segment-information.model';
import { MetaInformation } from '../models/meta-information.model';
export class Scene {

    private segmentsCount = 32;

    private responseSubject = new Subject<EngineActionResponse>();

    private segments: SceneSegmentInformation[] = [];
    private unsettledActors: UnsettledActorSavedData[] = [];

    private sessionChangedActors: Actor[] = [];
    private sessionDeletedActors: {id: number, x: number, y: number}[] = [];
    private sessionChangedTiles: Tile[] = [];
    private sessionReplacedTiles: Tile[] = [];
    private sessionRemovedTiles: {x: number, y: number}[] = [];

    private corpsesPool: Actor[] = [];

    private player: Actor;
    private currentSegment: number;
    private turn: number;

    private idIncrementor = 0;

    private aiActors: Actor[] = []; // TODO Temporal

    private tiles: Tile[][];

    private gatheringCorpsesStarted = false;
    private playerAliveInternal = true;

    readonly width: number;
    readonly height: number;

    public sceneSegmentChanged = false;

    get currentIdIncrement() {
        return this.idIncrementor;
    }

    get currentTurn() {
        return this.turn;
    }

    get playerSavedData() {
        return this.player.savedData;
    }

    get playerSegmentId() {
        return this.segments[this.currentSegment].sceneSegment.id;
    }

    get playerId() {
        return this.player.id;
    }

    get playerAlive() {
        return this.playerAliveInternal;
    }

    get snapshot(): SceneSnapshot {
        return {
            playerIsDead: this.player.dead,
            player: this.player.snapshot,
            turn: this.turn,
            width: this.width,
            height: this.height,
            tiles: this.tiles.map(x => x.map(y => y ? y.snapshot : undefined))
        } as SceneSnapshot;
    }

    constructor(
        sceneSegment: SceneSegment,
        playerData: PlayerSavedData,
        meta: MetaInformation,
        unsettledActors: UnsettledActorSavedData[],
        private nativeService: NativeService
    ) {
        const tileNumbers: { x: number; y: number; angle: number}[] = [];
        this.turn = meta.turn;
        this.width = meta.width;
        this.height = meta.height;
        this.tiles = new Array(meta.width);
        for (let x = 0; x < meta.width; x++) {
            this.tiles[x] = new Array(meta.height);
            for (let y = 0; y < meta.height; y++) {
                let angle = Math.atan2(y - this.height / 2, x - this.width / 2) + Math.PI;
                if (angle >= Math.PI * 2) {
                    angle -= Math.PI * 2;
                }
                if (angle < 0) {
                    angle += Math.PI * 2;
                }
                tileNumbers.push({
                    x,
                    y,
                    angle
                });
            }
        }
        const playerAngle = Math.atan2(playerData.actor.y - this.height / 2, playerData.actor.x - this.width / 2) + Math.PI;
        let playerSegment = Math.floor(playerAngle * this.segmentsCount / 2 / Math.PI);
        if (playerSegment >= this.segmentsCount) {
            playerSegment -= this.segmentsCount;
        }
        if (playerSegment < 0) {
            playerSegment += this.segmentsCount;
        }
        let emptySegment = playerSegment + this.segmentsCount / 2;
        if (emptySegment >= this.segmentsCount) {
            emptySegment -= this.segmentsCount;
        }
        let start = -6;
        let end = -6;
        for (let i = 0; i < this.segmentsCount; i++) {
            start = end;
            end = (i + 1) * Math.PI * 2 / this.segmentsCount;
            if (i === this.segmentsCount - 1) {
                end += 6;
            }
            const segment = {
                segmentTiles: tileNumbers
                .filter(tile => {
                    return tile.angle >= start && tile.angle < end;
                })
                .map(tile => {
                    return {x: tile.x, y: tile.y};
                })
            } as SceneSegmentInformation;
            let level: SceneSegment;
            let prevousLoop = false;
            let nextLoop = false;
            if (emptySegment > playerSegment && i > emptySegment) {
                level = sceneSegment.previousSegment || sceneSegment;
                prevousLoop = !sceneSegment.previousSegment;
            } else if (emptySegment < playerSegment && i < emptySegment) {
                level = sceneSegment.nextSegment || sceneSegment;
                nextLoop = !sceneSegment.nextSegment;
            } else if (i !== emptySegment) {
                level = sceneSegment;
            }
            this.segments.push(segment);
            this.loadSegment(segment, level, prevousLoop, nextLoop);
            this.sessionReplacedTiles.length = 0;
            this.sessionRemovedTiles.length = 0;
        }
        const player = this.createActor(nativeService.getActor(playerData.actor.nativeId), playerData.actor.x,
            playerData.actor.y, playerData.actor.name, playerData.actor.id);
        if (playerData.actor.durability || playerData.actor.durability === 0) {
            player.durability = playerData.actor.durability;
        }
        if (playerData.actor.energy || playerData.actor.energy === 0) {
            player.energy = playerData.actor.energy;
        }
        if (playerData.actor.remainedTurnTime || playerData.actor.remainedTurnTime === 0) {
            player.remainedTurnTime = playerData.actor.remainedTurnTime;
        }
        this.player = player;
        this.currentSegment = playerSegment;
        this.idIncrementor = meta.incrementor;
        this.pushUnsettledActors(unsettledActors);
    }

    subscribe(next: (value: EngineActionResponse) => void) {
        return this.responseSubject.subscribe(next);
    }

    unsubscribe() {
        this.responseSubject.unsubscribe();
    }

    // Creation
    createActor(native: ActorNative, x: number, y: number, name?: string, id?: number): Actor {
        if (!id) {
            id = this.idIncrementor;
        }
        this.idIncrementor++;
        const tile = this.getTile(x, y);
        if (tile) {
            const actor = new Actor(this, id, native, tile, name);
            this.aiActors.push(actor);
            if (!id) {
                this.registerActorChange(actor);
            }
            return actor;
        } else {
            return undefined;
        }
    }

    // ChangesRegistration
    pushUnsettledActors(actors: UnsettledActorSavedData[]) {
        for (const actor of actors) {
            // TODO SetupUnsettledActors
        }
    }

    pushDead(actor: Actor) {
        this.corpsesPool.push(actor);
    }

    registerActorPositionChange(oldX: number, oldY: number, actor: Actor) {
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
        if (!this.sessionChangedActors.includes(actor)) {
            this.sessionChangedActors.push(actor);
        }
    }

    registerActorDeath(actor: Actor) {
        if (actor === this.player) {
            this.playerAliveInternal = false;
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
        removeFromArray(this.aiActors, actor);
    }

    registerTileChange(tile: Tile) {
        tile.changed = true;
        if (!this.sessionChangedTiles.includes(tile)) {
            this.sessionChangedTiles.push(tile);
        }
    }

    registerPlayerPositionChange() {
        const initialPlayerSegment = this.segments[this.currentSegment].sceneSegment;
        const playerAngle = Math.atan2(this.player.y - this.height / 2, this.player.x - this.width / 2) + Math.PI;
        let playerSegment = Math.floor(playerAngle * this.segmentsCount / 2 / Math.PI);
        if (playerSegment >= this.segmentsCount) {
            playerSegment -= this.segmentsCount;
        }
        if (playerSegment < 0) {
            playerSegment += this.segmentsCount;
        }
        let difference = this.currentSegment - playerSegment;
        let differenceForComparison = Math.abs(this.currentSegment - playerSegment);
        let temporalDifference = Math.abs(this.currentSegment + this.segmentsCount - playerSegment);
        if (temporalDifference < differenceForComparison) {
            differenceForComparison = temporalDifference;
            difference = this.currentSegment + this.segmentsCount - playerSegment;
        }
        temporalDifference = Math.abs(this.currentSegment - this.segmentsCount - playerSegment);
        if (temporalDifference < differenceForComparison) {
            differenceForComparison = temporalDifference;
            difference = this.currentSegment - this.segmentsCount - playerSegment;
        }
        while (difference !== 0) {
            if (difference > 0) {
                this.currentSegment--;
                if (this.currentSegment < 0) {
                    this.currentSegment += this.segmentsCount;
                }
            } else {
                this.currentSegment++;
                if (this.currentSegment >= this.segmentsCount) {
                    this.currentSegment -= this.segmentsCount;
                }
            }
            const sceneSegment = this.segments[this.currentSegment];
            let emptySegment = this.currentSegment + this.segmentsCount / 2;
            if (emptySegment >= this.segmentsCount) {
                emptySegment -= this.segmentsCount;
            }
            let newSegment = emptySegment;
            if (difference > 0) {
                newSegment++;
                difference--;
            } else {
                newSegment--;
                difference++;
            }
            if (newSegment < 0) {
                newSegment += this.segmentsCount;
            }
            if (newSegment >= this.segmentsCount) {
                newSegment -= this.segmentsCount;
            }
            let level: SceneSegment;
            let previousLoop = false;
            let nextLoop = false;
            if (emptySegment > this.currentSegment && newSegment > emptySegment) {
                if (sceneSegment.nextLoop) {
                    level = sceneSegment.sceneSegment;
                } else {
                    level = sceneSegment.sceneSegment.previousSegment || sceneSegment.sceneSegment;
                }
                previousLoop = !sceneSegment.sceneSegment.previousSegment;
            } else if (emptySegment < this.currentSegment && newSegment < emptySegment) {
                if (sceneSegment.previousLoop) {
                    level = sceneSegment.sceneSegment;
                } else {
                    level = sceneSegment.sceneSegment.nextSegment || sceneSegment.sceneSegment;
                }
                nextLoop = !sceneSegment.sceneSegment.nextSegment;
            } else {
                level = sceneSegment.sceneSegment;
                if (sceneSegment.previousLoop) {
                    previousLoop = true;
                }
                if (sceneSegment.nextLoop) {
                    nextLoop = true;
                }
            }
            this.unloadSegment(this.segments[emptySegment]);
            this.loadSegment(this.segments[newSegment], level, previousLoop, nextLoop);
        }
        const resultPlayerSegment = this.segments[this.currentSegment];
        if (initialPlayerSegment !== resultPlayerSegment.sceneSegment &&
            ((resultPlayerSegment.sceneSegment.nextId && !resultPlayerSegment.sceneSegment.nextSegment) ||
            (!resultPlayerSegment.sceneSegment.previousSegment))) {
            this.sceneSegmentChanged = true;
        }
    }

    saveAllSegments() {
        for (const segment of this.segments) {
            if (segment.sceneSegment) {
                segment.sceneSegment.saveData(this.turn, segment.segmentTiles, this.tiles);
            }
        }
    }

    // Technic
    unloadSegment(segment: SceneSegmentInformation) {
        segment.sceneSegment.saveData(this.turn, segment.segmentTiles, this.tiles);
        segment.sceneSegment = undefined;
        segment.nextLoop = false;
        segment.previousLoop = false;
        for (const tilePosition of segment.segmentTiles) {
            const tile = this.tiles[tilePosition.x][tilePosition.y];
            if (tile) {
                for (const actor of tile.objects) {
                    removeFromArray(this.aiActors, actor);
                }
                this.tiles[tilePosition.x][tilePosition.y] = undefined;
            }
        }
    }
    loadSegment(segment: SceneSegmentInformation, sceneSegment: SceneSegment, previousLoop: boolean, nextLoop: boolean) {
        const num = this.segments.findIndex(x => x === segment);
        segment.sceneSegment = sceneSegment;
        segment.previousLoop = previousLoop;
        segment.nextLoop = nextLoop;
        if (sceneSegment) {
            for (const tilePosition of segment.segmentTiles) {
                const levelTile = sceneSegment.tiles[tilePosition.x][tilePosition.y];
                if (levelTile) {
                    const newTile = new Tile(this, this.nativeService.getTile(levelTile.nativeId),
                        tilePosition.x,
                        tilePosition.y,
                        sceneSegment.id);
                    this.tiles[tilePosition.x][tilePosition.y] = newTile;
                    for (const actor of levelTile.objects) {
                        const sceneActor = this.createActor(this.nativeService.getActor(actor.nativeId),
                            actor.x, actor.y, actor.name, actor.id);
                        if (actor.durability || actor.durability === 0) {
                            sceneActor.durability = actor.durability;
                        }
                        if (actor.energy || actor.energy === 0) {
                            sceneActor.energy = actor.energy;
                        }
                        if (actor.remainedTurnTime || actor.remainedTurnTime === 0) {
                            sceneActor.remainedTurnTime = actor.remainedTurnTime;
                        }
                    }
                    this.sessionReplacedTiles.push(newTile);
                } else {
                    this.tiles[tilePosition.x][tilePosition.y] = undefined;
                    this.sessionRemovedTiles.push({x: tilePosition.x, y: tilePosition.y});
                }
            }
        }
    }

    getObjectsByTile(x: number, y: number) {
        const tile = this.tiles[x][y];
        return tile ? tile.objects : [];
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
        for (const action of this.player.calculatedActions) {
            dictionary.push(this.parsePlayerAction({
                id: action.id,
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

    finishAction(reaction: ReactionResult, animation: string, x: number, y: number, reachedObjects: IReactiveObject[], important: boolean,
                 range?: number, extraIdentifier?: number, actor?: Actor) {
        this.responseSubject.next({
            actor: actor.snapshot,
            animation,
            x,
            y,
            extraIdentifier,
            changes: this.getSessionChanges(),
            result: reaction,
            range,
            important,
            reachedTiles: reachedObjects.filter(o => o instanceof Tile).map((o: Tile) => {
                return { x: o.x, y: o.y };
            })
        });
        if (!this.gatheringCorpsesStarted) {
            this.gatheringCorpsesStarted = true;
            while (this.corpsesPool.length > 0) {
                const corpse = this.corpsesPool.pop();
                this.registerActorDeath(corpse);
                corpse.doReactiveActionOnDeath();
            }
            this.gatheringCorpsesStarted = false;
        }
    }

    private getActorsForAction() {
        return this.aiActors.sort((a, b) => (a.calculatedSpeedModification + a.remainedTurnTime) -
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
                        id: 'wait',
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
            changedTiles: this.sessionChangedTiles.map(x => x.lightSnapshot),
            replacedTiles: this.sessionReplacedTiles.map(x => x.snapshot),
            removedTiles: this.sessionRemovedTiles
        } as SceneChanges;
        this.sessionChangedActors.length = 0;
        this.sessionDeletedActors = [];
        this.sessionChangedTiles.length = 0;
        this.sessionReplacedTiles.length = 0;
        this.sessionRemovedTiles = [];
        return result;
    }
}
