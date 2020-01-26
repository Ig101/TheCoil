import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, PartialObserver, Subscription } from 'rxjs';
import { Scene } from '../scene/scene.object';
import { SceneSnapshot } from '../models/scene/scene-snapshot.model';
import { EnginePlayerAction } from '../models/engine-player-action.model';
import { SceneInitialization } from '../models/scene/scene-initialization.model';
import { EngineActionTypeEnum } from '../models/enums/engine-action-type.enum';
import { Actor } from '../scene/objects/actor.object';
import { EngineActionResponse } from '../models/engine-action-response.model';
import { SceneSavedData } from '../models/scene/scene-saved-data.model';
import { NativeService } from './native.service';

@Injectable()
export class SceneService {

  private scene: Scene;

  private resoponseSubject = new Subject<EngineActionResponse[]>();
  private actionsSubject = new Subject<EnginePlayerAction[]>();

  constructor(
    private nativeService: NativeService
  ) {
    this.actionsSubject.subscribe(this.doAction);
  }

  subscribe(next: (value: EngineActionResponse[]) => void): Subscription {
    return this.resoponseSubject.subscribe(next);
  }

  setupNewScene(scene: SceneInitialization, sceneSavedData: SceneSavedData) {
    this.scene = new Scene(scene, sceneSavedData, this.nativeService);
  }

  getSceneSnapshot(): SceneSnapshot {
    return this.scene.snapshot;
  }

  getSceneSavedData(): SceneSavedData {
    return this.scene.savedData;
  }

  validateAndGetActions(action: EnginePlayerAction): EnginePlayerAction[] {
    return this.scene.parsePlayerAction(action);
  }

  sendActions(actions: EnginePlayerAction[]) {
    this.actionsSubject.next(actions);
  }

  private doAction(actions: EnginePlayerAction[]) {
    while (actions.length > 0) {
      const action = actions.shift();
      const changes = this.scene.playerAct(action);
      this.resoponseSubject.next(changes);
    }
  }
}
