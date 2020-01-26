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
import { createSceneGenerationFactory } from '../scene-generation/scene-generation-factory.helper';
import { TileInitialization } from '../models/scene/tile-initialization.model';

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

  private initializeScene(): SceneInitialization {
    this.randomService.setupNewSeed(this.metaInformation.seed);
    const factory = createSceneGenerationFactory(this.metaInformation.roomType,
      this.nativeService.getRoomSpawnsList(this.metaInformation.roomType, this.metaInformation.difficulty),
      this.randomService);
    const initialScene = factory.generate();
    initialScene.turn = this.metaInformation.turn;
    initialScene.tiles.length = initialScene.width;
    for (let x = 0; x < initialScene.width; x++) {
      for (let y = 0; y < initialScene.height; y++) {
        if (!initialScene.tiles.find(tile => tile.x === x && tile.y === y)) {
          initialScene.tiles.push({
            x,
            y,
            native: this.nativeService.getTile(`default${this.metaInformation.roomType}`)
          } as TileInitialization);
        }
      }
    }
    return initialScene;
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
          const sceneInitialization = this.initializeScene();
          this.sceneService.setupNewScene(sceneInitialization, response.result.scene);
          this.startSynchronizationTimer();
          return this.sceneService.getSceneSnapshot();
        } else {
          return null;
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
