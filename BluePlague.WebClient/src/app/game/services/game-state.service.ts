import { Injectable } from '@angular/core';
import { SceneSnapshot } from 'src/app/engine/models/scene/scene-snapshot.model';

@Injectable()
export class GameStateService {

  scene: SceneSnapshot;

  cameraX = 0;
  cameraY = 0;

  defaultWidth = 1920;
  defaultHeight = 1080;

  constructor() { }
}
