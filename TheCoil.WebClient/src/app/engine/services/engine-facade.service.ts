import { Injectable, OnInit } from '@angular/core';
import { SceneService } from './scene.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { EnginePlayerAction } from '../models/engine-player-action.model';
import { SynchronizationService } from './synchronization.service';
import { SceneSnapshot } from '../models/scene/scene-snapshot.model';
import { EngineActionResponse } from '../models/engine-action-response.model';
import { NativeService } from './native.service';
import { switchMap } from 'rxjs/operators';
import { MetaInformation } from '../models/meta-information.model';

@Injectable()
export class EngineFacadeService {

  constructor(
    private readonly sceneService: SceneService,
    private readonly nativeService: NativeService
  ) { }

  loadGame(newLoad: boolean = false) {
    this.nativeService.loadNatives();
    if (newLoad || !this.sceneService.sceneLoaded) {
      return this.sceneService.setupScene();
    } else {
      return of(this.sceneService.getSceneSnapshot());
    }
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
      id: 'smart',
      x,
      y
    }]);
  }

  subscribeOnMetaInformationChange(next: (value: MetaInformation) => void) {
    return this.sceneService.subscribeOnMeta(next);
  }

  subscribeOnActionsResult(next: (value: EngineActionResponse) => void, unsubscription?: (value: unknown) => void) {
    this.sceneService.subscribe(next, unsubscription);
  }
}
