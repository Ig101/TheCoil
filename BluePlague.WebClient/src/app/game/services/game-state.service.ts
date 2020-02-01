import { Injectable } from '@angular/core';
import { SceneSnapshot } from 'src/app/engine/models/scene/scene-snapshot.model';

@Injectable()
export class GameStateService {

  changed = false;

  defaultWidth = 1920;
  defaultHeight = 1080;

  private sceneInternal: SceneSnapshot;
  private cameraXInternal = 0;
  private cameraYInternal = 0;

  get scene() {
    return this.sceneInternal;
  }

  set scene(value: SceneSnapshot) {
    this.changed = true;
    this.sceneInternal = value;
  }

  get cameraX() {
    return this.cameraXInternal;
  }

  set cameraX(value: number) {
    this.changed = true;
    this.cameraXInternal = value;
  }

  get cameraY() {
    return this.cameraYInternal;
  }

  set cameraY(value: number) {
    this.changed = true;
    this.cameraYInternal = value;
  }

  constructor() { }
}
