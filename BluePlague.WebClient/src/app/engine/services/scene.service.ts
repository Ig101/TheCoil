import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, PartialObserver, Subscription, Observable } from 'rxjs';
import { Scene } from '../scene/scene.object';
import { SceneSnapshot } from '../models/scene/scene-snapshot.model';
import { EnginePlayerAction } from '../models/engine-player-action.model';
import { SceneInitialization } from '../models/scene/scene-initialization.model';
import { Actor } from '../scene/objects/actor.object';
import { EngineActionResponse } from '../models/engine-action-response.model';
import { SceneSavedData } from '../models/scene/scene-saved-data.model';
import { NativeService } from './native.service';
import { UnsettledActorSavedData } from '../models/scene/objects/unsettled-actor-saved-data.model';

@Injectable()
export class SceneService {

  private scene: Scene;
  private unsettledActors: UnsettledActorSavedData[] = [];

  get sceneLoaded(): boolean {
    return this.scene !== undefined;
  }

  constructor(
    private nativeService: NativeService
  ) { }

  subscribe(next: (value: EngineActionResponse) => void, unsubscription?: (value: unknown) => void) {
    return this.scene.subscribe(next, unsubscription);
  }

  setupNewScene(scene: SceneInitialization, sceneSavedData: SceneSavedData) {
    if (this.scene) {
      this.scene.unsubscribe();
    }
    this.scene = new Scene(scene, sceneSavedData, this.nativeService);
  }

  pushUnsettledActors(unsettledActors: UnsettledActorSavedData[]) {
    if (unsettledActors.length > 0) {
      this.unsettledActors.push(...unsettledActors);
    }
  }

  getSceneSnapshot(): SceneSnapshot {
    return this.scene.snapshot;
  }

  getSceneSavedData(): SceneSavedData {
    return this.scene.savedData;
  }

  validateAndGetAction(action: EnginePlayerAction) {
    return this.scene.parsePlayerAction(action, true);
  }

  validateAndGetAllActions(x: number, y: number) {
    return this.scene.parseAllPlayerActions(x, y);
  }

  sendActions(actions: EnginePlayerAction[]) {
    while (actions.length > 0) {
      const action = actions.shift();
      this.scene.playerAct(action, this.unsettledActors);
      this.unsettledActors = [];
    }
  }
}
