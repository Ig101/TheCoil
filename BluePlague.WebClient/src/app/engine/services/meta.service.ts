import { Injectable } from '@angular/core';
import { SceneService } from './scene.service';
import { SynchronizationService } from './synchronization.service';
import { MetaInformation } from '../models/meta-information.model';
import { map, tap, switchMap } from 'rxjs/operators';
import { SceneSnapshot } from '../models/scene/scene-snapshot.model';
import { SceneSavedData } from '../models/scene/scene-saved-data.model';
import { SceneInitialization } from '../models/scene/scene-initialization.model';
import { Observable, of } from 'rxjs';
import { NativeService } from './native.service';
import { EnginePlayerAction } from '../models/engine-player-action.model';
import { TileInitialization } from '../models/scene/tile-initialization.model';
import { GeneratorService } from './generator.service';
import { RoomTypeEnum } from '../models/enums/room-type.enum';

@Injectable()
export class MetaService {

  private readonly synchronizationTimer = 20000;
  private timer;
  private currentActionsBanch: EnginePlayerAction[] = [];
  private lastActionsBanch: EnginePlayerAction[] = [];

  private metaInformationInternal: MetaInformation;

  get metaInformation() {
    return this.metaInformationInternal;
  }

  constructor(
    private readonly sceneService: SceneService,
    private readonly synchronizationService: SynchronizationService,
    private readonly nativeService: NativeService,
    private readonly generatorService: GeneratorService
  ) { }

  private initializeScene(): Observable<SceneInitialization> {
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
  }

  loadGame(): Observable<SceneSnapshot> {
    return this.synchronizationService.loadGame()
      .pipe(switchMap(response => {
        if (response.success) {
          this.metaInformationInternal = response.result.meta;
          return this.initializeScene()
            .pipe(map(sceneInitialization => {
              this.sceneService.setupNewScene(sceneInitialization, response.result.scene);
              this.sceneService.subscribe(action => {
                this.currentActionsBanch.push({
                  name: action.animation,
                  extraIdentifier: action.extraIdentifier,
                  x: action.x,
                  y: action.y
                } as EnginePlayerAction);
              });
              this.startSynchronizationTimer();
              return this.sceneService.getSceneSnapshot();
            }));
        } else {
          return of(null);
        }
      }));
  }

  stopSynchronizationTimer() {
    clearInterval(this.timer);
  }

  synchronization() {
    this.lastActionsBanch.push(...this.currentActionsBanch);
    this.currentActionsBanch.length = 0;
    this.synchronizationService.sendSynchronizationInfo(this.sceneService.getSceneSavedData(),
                                                        this.metaInformation, this.lastActionsBanch)
      .subscribe(result => {
        if (result.success) {
          this.lastActionsBanch = [];
          this.sceneService.pushUnsettledActors(result.result.scene.unsettledActors);
        } else {
          // TODO ExitGame
        }
      });

  }

  private startSynchronizationTimer() {
    this.timer = setInterval(this.timedSynchronization, this.synchronizationTimer, this);
  }

  private timedSynchronization(metaService: MetaService) {
    metaService.synchronization();
  }
}
