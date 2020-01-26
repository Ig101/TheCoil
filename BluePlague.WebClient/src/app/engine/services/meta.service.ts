import { Injectable } from '@angular/core';
import { SceneService } from './scene.service';
import { SynchronizationService } from './synchronization.service';
import { MetaInformation } from '../models/meta-information.model';
import { map } from 'rxjs/operators';
import { SceneSnapshot } from '../models/scene/scene-snapshot.model';
import { SceneSavedData } from '../models/scene/scene-saved-data.model';
import { SceneInitialization } from '../models/scene/scene-initialization.model';
import { Observable } from 'rxjs';
import { RandomService } from 'src/app/shared/services/random.service';
import { NativeService } from './native.service';
import { EnginePlayerAction } from '../models/engine-player-action.model';

@Injectable()
export class MetaService {

  private readonly synchronizationTimer = 20000;
  private timer: NodeJS.Timer;
  private currentActionsBanch: EnginePlayerAction[];
  private lastActionsBanch: EnginePlayerAction[];

  private metaInformationInternal: MetaInformation;

  get metaInformation() {
    return this.metaInformationInternal;
  }

  constructor(
    private readonly sceneService: SceneService,
    private readonly synchronizationService: SynchronizationService,
    private readonly nativeService: NativeService,
    private readonly randomService: RandomService
  ) {
    this.sceneService.subscribe(actions => {
      const playerAction = actions[0].action;
      this.currentActionsBanch.push({
        type: playerAction.type,
        extraIdentifier: playerAction.extraIdentifier,
        x: playerAction.x,
        y: playerAction.y
      } as EnginePlayerAction);
    });
  }

  private initializeScene(response: SceneSavedData): SceneInitialization {
    throw new Error('Method not implemented.');
  }

  private synchronization() {
    this.lastActionsBanch.push(...this.currentActionsBanch);
    this.currentActionsBanch = [];
    this.synchronizationService.sendSynchronizationInfo(this.sceneService.getSceneSavedData(),
                                                        this.metaInformation, this.lastActionsBanch)
      .subscribe(result => {
        if (result.success) {
          this.lastActionsBanch.length = 0;
        } else {
          // TODO ExitGame
        }
      });

  }

  loadGame(): Observable<SceneSnapshot> {
    return this.synchronizationService.loadGame()
      .pipe(map(response => {
        if (response.success) {
          this.metaInformationInternal = response.result.meta;
          const sceneInitialization = this.initializeScene(response.result.scene);
          this.sceneService.setupNewScene(sceneInitialization);
          this.startSynchronizationTimer();
          return this.sceneService.getSceneSnapshot();
        }
      }));
  }

  stopSynchronizationTimer() {
    clearInterval(this.timer);
  }

  startSynchronizationTimer() {
    this.timer = setInterval(this.synchronization, this.synchronizationTimer);
  }
}
