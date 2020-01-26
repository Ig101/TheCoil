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

@Injectable()
export class MetaService {

  private readonly synchronizationTimer = 20000;
  private timer: NodeJS.Timer;

  private metaInformationInternal: MetaInformation;

  get metaInformation() {
    return this.metaInformationInternal;
  }

  constructor(
    private readonly sceneService: SceneService,
    private readonly synchronizationService: SynchronizationService,
    private readonly nativeService: NativeService,
    private readonly randomService: RandomService
  ) { }

  private initializeScene(response: SceneSavedData): SceneInitialization {
    throw new Error('Method not implemented.');
  }

  private synchronization() {

  }

  loadGame(): Observable<SceneSnapshot> {
    return this.synchronizationService.loadGame()
      .pipe(map(response => {
        if (response.success) {
          this.metaInformationInternal = response.result.meta;
          const sceneInitialization = this.initializeScene(response.result.scene);
          this.sceneService.setupNewScene(sceneInitialization);
          this.timer = setInterval(this.synchronization, this.synchronizationTimer);
          return this.sceneService.getSceneSnapshot();
        }
      }));
  }

}
