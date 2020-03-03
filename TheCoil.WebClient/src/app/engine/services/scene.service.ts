import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, PartialObserver, Subscription, Observable } from 'rxjs';
import { Scene } from '../scene/scene.object';
import { SceneSnapshot } from '../models/scene/scene-snapshot.model';
import { EnginePlayerAction } from '../models/engine-player-action.model';
import { Actor } from '../scene/objects/actor.object';
import { EngineActionResponse } from '../models/engine-action-response.model';
import { NativeService } from './native.service';
import { UnsettledActorSavedData } from '../models/scene/objects/unsettled-actor-saved-data.model';
import { SceneSegmentSavedData } from '../models/scene-segment-saved-data.model';
import { SceneSegment } from '../scene/scene-segment.object';
import { PlayerSavedData } from '../models/player-saved-data.model';
import { GeneratorService } from './generator.service';
import { GameStateEnum } from '../models/enums/game-state.enum';
import { MetaInformation } from '../models/meta-information.model';
import { EngineAction } from '../models/engine-action.model';
import { SynchronizationService } from './synchronization.service';

@Injectable()
export class SceneService {

  private scene: Scene;
  private sceneSegments: { [level: number]: SceneSegment } = {};
  private unsettledActors: UnsettledActorSavedData[] = [];

  private readonly synchronizationTimer = 20000;
  private timer;
  private currentActionsBanch: EngineAction[] = [];
  private lastActionsBanch: EngineAction[] = [];
  private sceneChanged = false;

  private metaInformation: MetaInformation;

  private metaSubject = new BehaviorSubject<MetaInformation>(undefined);
  private unsubscribeSubject = new Subject<any>();

  get sceneLoaded(): boolean {
    return this.scene !== undefined;
  }

  constructor(
    private nativeService: NativeService,
    private generatorService: GeneratorService,
    private synchronizationService: SynchronizationService
  ) { }

  isPlayerAlive() {
    return this.scene.playerAlive;
  }

  subscribe(next: (value: EngineActionResponse) => void, unsubscription?: (value: unknown) => void) {
    if (unsubscription) {
      this.unsubscribeSubject.subscribe(unsubscription);
    }
    return this.scene.subscribe(next);
  }

  setupScene(): Observable<SceneSnapshot> {
    this.scene.unsubscribe();
    this.unsubscribeSubject.next();
    // TODO LoadScene
        /*return this.synchronizationService.loadGame()
      .pipe(switchMap(response => {
        if (response.success) {
          this.metaInformationInternal = response.result.meta;
          this.registerMetaInformationChange();
          return this.initializeScene()
            .pipe(map(sceneInitialization => {
              this.sceneService.setupNewScene(sceneInitialization, response.result.scene);
              this.sceneService.subscribe(action => {
                this.sceneChanged = true;
                if (action.important) {
                  this.currentActionsBanch.push({
                    id: action.animation,
                    extraIdentifier: action.extraIdentifier,
                    actorId: action.actor ? action.actor.id : undefined,
                    x: action.x,
                    y: action.y
                  } as EngineAction);
                }
                if (!this.sceneService.isPlayerAlive() && this.metaInformation.gameState !== GameStateEnum.Defeat) {
                  this.changeState(GameStateEnum.Defeat);
                }
              });
              this.startSynchronizationTimer();
              return this.sceneService.getSceneSnapshot();
            }));
        } else {
          return of(null);
        }
      }));*/
      
  /*private initializeScene(): Observable<SceneInitialization> {
    return this.generatorService.generateScene(this.metaInformation.roomType, this.metaInformation.seed)
      .pipe(map(initialScene => {
        for (let x = 0; x < initialScene.width; x++) {
          for (let y = 0; y < initialScene.height; y++) {
            if (!initialScene.tiles.find(tile => tile.x === x && tile.y === y)) {
              initialScene.tiles.push({
                x,
                y,
                native: this.nativeService.getTile(`default${RoomTypeEnum[this.metaInformation.roomType]}`)
              } as TileInitialization);
            }
          }
        }
        return initialScene;
      }));
  }*/
    // this.scene = new Scene(sceneSegment)
  }

  pushNewSceneSegments(sceneSegmentsForInsert: SceneSegmentSavedData[]) {
    for (const sceneSegment of sceneSegmentsForInsert) {
      if (this.sceneSegments[sceneSegment.id]) {
        this.sceneSegments[sceneSegment.id].updateSceneBySavedData(sceneSegment);
      } else {
        this.sceneSegments[sceneSegment.id] =
          this.generatorService.generateScene(sceneSegment, this.metaInformation.width, this.metaInformation.height);
      }
    }
    for (const sceneSegment of Object.values(this.sceneSegments)) {
      if (!sceneSegment.nextSegment && sceneSegment.nextId) {
        sceneSegment.nextSegment = this.sceneSegments[sceneSegment.nextId];
        sceneSegment.nextSegment.previousId = sceneSegment.id;
        sceneSegment.nextSegment.previousSegment = sceneSegment;
      }
    }
  }

  pushUnsettledActors(unsettledActors: UnsettledActorSavedData[]) {
    if (unsettledActors.length > 0) {
      this.unsettledActors.push(...unsettledActors);
    }
  }

  getSceneSnapshot(): SceneSnapshot {
    return this.scene.snapshot;
  }

  validateAndGetAction(action: EnginePlayerAction) {
    return this.scene.parsePlayerAction(action, true);
  }

  validateAndGetAllActions(x: number, y: number) {
    return this.scene.parseAllPlayerActions(x, y);
  }

  validatePlayerSmartAction(x: number, y: number) {
    return this.scene.parsePlayerSmartAction(x, y);
  }

  sendActions(actions: EnginePlayerAction[]) {
    while (actions.length > 0) {
      const action = actions.shift();
      this.scene.playerAct(action, this.unsettledActors);
      this.unsettledActors = [];
    }
  }

  changeState(state: GameStateEnum) {
    this.metaInformation.gameState = state;
    this.synchronization();
    this.registerMetaInformationChange();
  }

  registerMetaInformationChange() {
    this.metaSubject.next(Object.assign({}, this.metaInformation));
  }

  stopSynchronizationTimer() {
    clearInterval(this.timer);
  }

  synchronization() {
    if (this.sceneChanged) {
      this.scene.saveAllSegments();
      // TODO Sync
     /* this.sceneChanged = false;
      this.lastActionsBanch.push(...this.currentActionsBanch);
      this.currentActionsBanch.length = 0;
      this.synchronizationService.sendSynchronizationInfo(this.sceneService.getSceneSavedData(),
                                                          this.metaInformation, this.lastActionsBanch)
        .subscribe(result => {
          if (result.success) {
            this.lastActionsBanch = [];
            this.sceneService.pushUnsettledActors(result.result.scene.unsettledActors);
            // TODO register changes
          } else {
            // TODO ExitGame
          }
        });*/
    }

  }

  private startSynchronizationTimer() {
    this.timer = setInterval(this.timedSynchronization, this.synchronizationTimer, this);
  }

  private timedSynchronization(sceneService: SceneService) {
    sceneService.synchronization();
  }
}
