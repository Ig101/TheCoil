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

    private segmentsCount = 8;

    private responseSubject = new Subject<EngineActionResponse>();

    private segments: SceneSegmentInformation[] = [];
    private unsettledActors: UnsettledActorSavedData[] = [];

    private sessionChangedActors: Actor[] = [];
    private sessionDeletedActors: {id: number, x: number, y: number}[] = [];
    private sessionChangedTiles: Tile[] = [];

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
        const tileNumbers: { x: number; y: number; }[] = [];
        for (let x = 0; x < meta.width; x++) {
            this.tiles[x] = [];
            for (let y = 0; y < meta.height; y++) {
                tileNumbers.push({
                    x,
                    y
                });
            }
        }
        const playerAngle = Math.atan2(playerData.actor.y - this.height / 2, playerData.actor.x - this.width / 2) + Math.PI;
        const playerSegment = Math.floor(playerAngle * this.segmentsCount / 2 / Math.PI);
        let emptySegment = playerSegment + this.segmentsCount / 2;
        if (emptySegment >= this.segmentsCount) {
            emptySegment -= this.segmentsCount;
        }
        for (let i = 0; i < this.segmentsCount; i++) {
            const start = i * Math.PI * 2 / this.segmentsCount;
            const end = (i + 1) * Math.PI * 2 / this.segmentsCount;
            const segment = {
                segmentTiles: tileNumbers.filter(tile => {
                    const angle = Math.atan2(tile.y - this.height / 2, tile.x - this.width / 2) + Math.PI;
                    return angle >= start && angle < end;
                })
            } as SceneSegmentInformation;
            const level = emptySegment > playerSegment && i > emptySegment ? (sceneSegment.previousSegment || sceneSegment) :
            emptySegment < playerSegment && i < emptySegment ? (sceneSegment.nextSegment || sceneSegment) :
            i !== emptySegment ? sceneSegment : undefined;
            this.segments.push(segment);
            this.loadSegment(segment, level);
        }
        this.currentSegment = playerSegment;
        this.turn = meta.turn;
        this.width = meta.width;
        this.height = meta.height;
        this.tiles = new Array(this.width);
        for (let x = 0; x < this.width; x++) {
            this.tiles[x] = new Array(this.height);
        }
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
            if (actor.player) {

            }
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
        const playerAngle = Math.atan2(this.player.y - this.height / 2, this.player.x - this.width / 2) + Math.PI;
        const playerSegment = Math.floor(playerAngle * this.segmentsCount / 2 / Math.PI);
        let difference = this.currentSegment - playerSegment;
        while (difference !== 0) {
            const sceneSegment = this.segments[playerSegment].sceneSegment;
            let newSegment = playerSegment + this.segmentsCount / 2;
            if (newSegment >= this.segmentsCount) {
                newSegment -= this.segmentsCount;
            }
            let emptySegment = newSegment;
            if (difference > 0) {
                emptySegment++;
                difference--;
            } else {
                emptySegment--;
                difference++;
            }
            const level = emptySegment > playerSegment && newSegment > emptySegment ? (sceneSegment.previousSegment || sceneSegment) :
                emptySegment < playerSegment && newSegment < emptySegment ? (sceneSegment.nextSegment || sceneSegment) :
                sceneSegment;
            this.loadSegment(this.segments[newSegment], level);
            this.unloadSegment(this.segments[emptySegment]);
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
        for (const tilePosition of segment.segmentTiles) {
            segment.sceneSegment.tiles[tilePosition.x][tilePosition.y] = undefined;
        }
    }

    loadSegment(segment: SceneSegmentInformation, sceneSegment: SceneSegment) {
        segment.sceneSegment = sceneSegment;
        for (const tilePosition of segment.segmentTiles) {
            const levelTile = sceneSegment.tiles[tilePosition.x][tilePosition.y];
            this.tiles[tilePosition.x][tilePosition.y] =
                new Tile(this, this.nativeService.getTile(levelTile.nativeId),
                    tilePosition.x,
                    tilePosition.y,
                    sceneSegment.id);
            for (const actor of levelTile.objects) {
                const sceneActor = this.createActor(this.nativeService.getActor(actor.nativeId), actor.x, actor.y, actor.name, actor.id);
                sceneActor.durability = actor.durability;
                sceneActor.energy = actor.energy;
                sceneActor.remainedTurnTime = actor.remainedTurnTime;
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
            changedTiles: this.sessionChangedTiles.map(x => x.lightSnapshot)
        };
        this.sessionChangedActors.length = 0;
        this.sessionDeletedActors = [];
        this.sessionChangedTiles.length = 0;
        return result;
    }
}
