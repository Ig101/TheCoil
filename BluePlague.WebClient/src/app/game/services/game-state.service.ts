import { Injectable } from '@angular/core';
import { SceneSnapshot } from 'src/app/engine/models/scene/scene-snapshot.model';

@Injectable()
export class GameStateService {

  scene: SceneSnapshot;

  constructor() { }
}
