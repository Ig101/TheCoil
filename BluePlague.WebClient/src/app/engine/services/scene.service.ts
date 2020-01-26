import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, PartialObserver, Subscription } from 'rxjs';
import { Scene } from '../scene/scene.object';
import { SceneSnapshot } from '../models/scene/scene-snapshot.model';
import { EnginePlayerAction } from '../models/engine-player-action.model';
import { SceneInitialization } from '../models/scene/scene-initialization.model';
import { EngineActionTypeEnum } from '../models/enums/engine-action-type.enum';
import { Actor } from '../scene/objects/actor.object';
import { EngineActionResponse } from '../models/engine-action-response.model';

@Injectable()
export class SceneService {

  private scene: Scene;

  private resoponseSubject = new Subject<EngineActionResponse[]>();
  private actionsSubject = new Subject<EnginePlayerAction[]>();

  constructor() {
    this.actionsSubject.subscribe(this.doAction);
  }

  subscribe(observer: PartialObserver<EngineActionResponse[]>): Subscription {
    return this.resoponseSubject.subscribe(observer);
  }

  setupNewScene(scene: SceneInitialization) {
    this.scene = new Scene(scene);
  }

  getSceneSnapshot(): SceneSnapshot {
    return this.scene.snapshot;
  }

  validateAndGetActions(action: EnginePlayerAction): EnginePlayerAction[] {
    return this.scene.parsePlayerAction(action);
  }

  sendActions(actions: EnginePlayerAction[]) {
    this.actionsSubject.next(actions);
  }

  private doAction(actions: EnginePlayerAction[]) {
    console.log(1);
    while (actions.length > 0) {
      const action = actions.shift();
      const changes = this.scene.playerAct(action);
      this.resoponseSubject.next(changes);
    }
    console.log(2);
  }
}
