import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, PartialObserver, Subscription, Observable, of } from 'rxjs';
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
import { switchMap, map } from 'rxjs/operators';

@Injectable()
export class SceneService {

  private scene: Scene;
  private sceneSegments: { [level: number]: SceneSegment } = {};
  private unsettledActors: UnsettledActorSavedData[] = [];

  private readonly synchronizationTimer = 20000;
  private timer;
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

  subscribeOnMeta(next: (value: MetaInformation) => void) {
    return this.metaSubject.subscribe(next);
  }

  adjournScene() {
    if (this.scene) {
      this.scene.unsubscribe();
      this.unsubscribeSubject.next();
      this.synchronization();
      this.stopSynchronizationTimer();
      this.scene = null;
    }
  }

  setupScene(): Observable<SceneSnapshot> {
    this.adjournScene();
    return this.synchronizationService.loadGame()
    .pipe(map(response => {
      if (response.success) {
        this.metaInformation = response.result.metaInformation;
        this.registerMetaInformationChange();
        this.sceneSegments = {};
        this.sceneChanged = false;
        this.pushNewSceneSegments(response.result.sceneSegments);
        this.scene = new Scene(this.sceneSegments[response.result.player.scene],
          response.result.player,
          response.result.metaInformation,
          response.result.unsettledActors,
          this.nativeService);
        this.scene.subscribe(action => {
          this.sceneChanged = true;
          if (this.scene.sceneSegmentChanged) {
            this.scene.sceneSegmentChanged = false;
            this.forcedSynchronization();
          }
          if (!this.scene.playerAlive && this.metaInformation.gameState !== GameStateEnum.Defeat) {
            this.changeState(GameStateEnum.Defeat);
          }
        });
        this.startSynchronizationTimer();
        return this.scene.snapshot;
      } else {
        return null;
        // TODO Error
      }
    }));
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
    this.forcedSynchronization();
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
      this.metaInformation.turn = this.scene.currentTurn;
      this.metaInformation.incrementor = this.scene.currentIdIncrement;
      this.sceneChanged = false;
      this.synchronizationService.sendSynchronizationInfo(
        Object.values(this.sceneSegments).filter(x => x.changed).map(x => x.sceneSegmentSavedData),
        this.metaInformation,
        {
          actor: this.scene.playerSavedData,
          scene: this.scene.playerSegmentId
        } as PlayerSavedData)
        .subscribe(result => {
          if (result.success) {
            this.scene.pushUnsettledActors(result.result.unsettledActors);
          } else {
            // TODO Error handling
          }
        });
    }
  }

  forcedSynchronization() {
    this.startSynchronizationTimer();
    this.synchronization();
  }

  private startSynchronizationTimer() {
    this.stopSynchronizationTimer();
    this.timer = setInterval(this.timedSynchronization, this.synchronizationTimer, this);
  }

  private timedSynchronization(sceneService: SceneService) {
    sceneService.synchronization();
  }
}
