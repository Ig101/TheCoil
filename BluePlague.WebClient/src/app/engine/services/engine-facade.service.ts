import { Injectable, OnInit } from '@angular/core';
import { MetaService } from './meta.service';
import { SceneService } from './scene.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { EnginePlayerAction } from '../models/engine-player-action.model';
import { SynchronizationService } from './synchronization.service';
import { SceneSnapshot } from '../models/scene/scene-snapshot.model';
import { EngineSnapshot } from '../models/engine-snapshot.model';
import { EngineActionResponse } from '../models/engine-action-response.model';

@Injectable()
export class EngineFacadeService {

  constructor(
    private readonly metaService: MetaService,
    private readonly sceneService: SceneService
  ) { }

  loadGame() {
    return this.metaService.loadGame();
  }

  validateAndGetActions(action: EnginePlayerAction) {
    return this.sceneService.validateAndGetActions(action);
  }

  validateAndGetAllActions(x: number, y: number) {
    return this.sceneService.validateAndGetAllActions(x, y);
  }

  sendActions(actions: EnginePlayerAction[]) {
    this.sceneService.sendActions(actions);
  }

  subscribeOnActionsResult(next: (value: EngineActionResponse[]) => void) {
    this.sceneService.subscribe(next);
  }
}
