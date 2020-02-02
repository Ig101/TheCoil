import { Injectable } from '@angular/core';
import { SceneSnapshot } from 'src/app/engine/models/scene/scene-snapshot.model';

@Injectable()
export class GameStateService {

  scene: SceneSnapshot;
  cameraX = 0;
  cameraY = 0;

  get playerX() {
    return this.scene.player.x;
  }

  get playerY() {
    return this.scene.player.y;
  }

  constructor() { }
}
