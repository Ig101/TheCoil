import { Injectable, OnInit } from '@angular/core';
import { MetaService } from './meta.service';
import { SceneService } from './scene.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { EnginePlayerAction } from '../models/engine-player-action.model';
import { SynchronizationService } from './synchronization.service';
import { SceneSnapshot } from '../models/scene/scene-snapshot.model';
import { EngineSnapshot } from '../models/engine-snapshot.model';
import { EngineActionResponse } from '../models/engine-action-response.model';
import { NativeService } from './native.service';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class EngineFacadeService {

  constructor(
    private readonly metaService: MetaService,
    private readonly sceneService: SceneService,
    private readonly nativeService: NativeService
  ) { }

  loadGame(newLoad: boolean = false) {
    return this.nativeService.loadNatives()
      .pipe(switchMap(result => {
        if (result.success) {
          if (newLoad || !this.sceneService.sceneLoaded) {
            return this.metaService.loadGame();
          } else {
            return of(this.sceneService.getSceneSnapshot());
          }
        } else {
          return of(undefined as SceneSnapshot);
        }
      }));
  }

  validateAndGetAction(action: EnginePlayerAction) {
    return this.sceneService.validateAndGetAction(action);
  }

  validateAndGetAllActions(x: number, y: number) {
    return this.sceneService.validateAndGetAllActions(x, y);
  }

  validateSmartAction(x: number, y: number) {
    return this.sceneService.validatePlayerSmartAction(x, y);
  }

  sendActions(actions: EnginePlayerAction[]) {
    this.sceneService.sendActions(actions);
  }

  sendSmartAction(x: number, y: number) {
    this.sceneService.sendActions([{
      type: 'smart',
      x,
      y
    }]);
  }

  subscribeOnActionsResult(next: (value: EngineActionResponse) => void, unsubscription?: (value: unknown) => void) {
    this.sceneService.subscribe(next, unsubscription);
  }
}
