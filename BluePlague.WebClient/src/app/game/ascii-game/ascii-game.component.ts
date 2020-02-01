import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { SceneSnapshot } from 'src/app/engine/models/scene/scene-snapshot.model';
import { EngineFacadeService } from 'src/app/engine/services/engine-facade.service';
import { GameStateService } from '../services/game-state.service';
import { EngineActionResponse } from 'src/app/engine/models/engine-action-response.model';
import { SpriteSnapshot } from 'src/app/engine/models/scene/abstract/sprite-snapshot.model';
import { KeyboardKeyEnum } from 'src/app/shared/models/enum/keyboard-key.enum';

@Component({
  selector: 'app-ascii-game',
  templateUrl: './ascii-game.component.html',
  styleUrls: ['./ascii-game.component.scss']
})
export class AsciiGameComponent implements OnInit, OnDestroy {

  @ViewChild('gameCanvas', { static: true }) gameCanvas: ElementRef<HTMLCanvasElement>;

  lastChange: number;

  drawingTimer;
  changed = false;

  tileWidth = 0;
  readonly tileHeight = 80;
  readonly defaultAspectRatio = 16 / 9;
  readonly defaultWidth = 1920;
  readonly defaultHeight = 1080;
  defaultManyActorsSprite = {
    character: '*',
    color: {r: 255, g: 255, b: 0, a: 1}
  } as SpriteSnapshot;
  pressedKeys: { [id: string]: boolean } = {};

  set zoom(value: number) {
    this.gameStateService.zoom = value;
    this.setupAspectRatio(this.gameCanvas.nativeElement.width, this.gameCanvas.nativeElement.height);
  }

  get canvasWidth() {
    return this.gameCanvas.nativeElement.width;
  }

  get canvasHeight() {
    return this.gameCanvas.nativeElement.height;
  }

  private canvasContext: CanvasRenderingContext2D;

  constructor(
    private gameStateService: GameStateService,
    private engineFacadeService: EngineFacadeService) { }

  ngOnInit() {
    this.tileWidth = this.tileHeight * 0.6;
    this.setupAspectRatio(this.gameCanvas.nativeElement.offsetWidth, this.gameCanvas.nativeElement.offsetHeight);
    this.canvasContext = this.gameCanvas.nativeElement.getContext('2d');
    this.engineFacadeService.loadGame()
      .subscribe(result => {
        this.gameStateService.scene = result;
        this.gameStateService.cameraX = result.player.x;
        this.gameStateService.cameraY = result.player.y;
        this.changed = true;
        this.engineFacadeService.subscribeOnActionsResult(this.processNewAction, this.sceneWasDeleted);
        this.drawingTimer = setInterval(this.redrawScene, 30, this);
      });
  }

  ngOnDestroy(): void {
    clearInterval(this.drawingTimer);
  }

  onResize(event) {
    this.setupAspectRatio(event.target.innerWidth, event.target.innerHeight);
  }

  onKeyDown(event: KeyboardEvent) {
    this.pressedKeys[event.key] = true;
  }

  onKeyUp(event) {
    this.pressedKeys[event.key] = false;
  }

  onMouseDown(event) {

  }

  onMouseUp(event) {

  }

  onMouseMove(event) {

  }

  @HostListener('contextmenu', ['$event'])
  onContextMenu(event) {
    event.preventDefault();
  }

  cameraShiftX(value: number) {
    this.gameStateService.cameraX += value;
    this.changed = true;
  }

  cameraShiftY(value: number) {
    this.gameStateService.cameraY += value;
    this.changed = true;
  }

  processNewAction(response: EngineActionResponse) {
    // TODO process changes
    this.changed = true;
  }

  sceneWasDeleted() {

  }

  setupAspectRatio(width: number, height: number) {
    const newAspectRatio = width / height;
    if (newAspectRatio > this.defaultAspectRatio) {
      const oldWidth = this.defaultWidth / this.gameStateService.zoom;
      this.gameCanvas.nativeElement.width = oldWidth;
      this.gameCanvas.nativeElement.height = oldWidth / newAspectRatio;
    } else {
      const oldHeight = this.defaultHeight / this.gameStateService.zoom;
      this.gameCanvas.nativeElement.width = oldHeight * newAspectRatio;
      this.gameCanvas.nativeElement.height = oldHeight;
    }
    this.changed = true;
    this.redrawScene(this);
  }

  // Drawing

  private processKeys(context: AsciiGameComponent, shift: number) {
    if (context.pressedKeys[KeyboardKeyEnum.ArrowDown]) {
      context.cameraShiftY(shift * 0.01 / context.gameStateService.zoom);
    }
    if (context.pressedKeys[KeyboardKeyEnum.ArrowUp]) {
      context.cameraShiftY(-shift * 0.01 / context.gameStateService.zoom);
    }
    if (context.pressedKeys[KeyboardKeyEnum.ArrowLeft]) {
      context.cameraShiftX(-shift * 0.01 / context.gameStateService.zoom);
    }
    if (context.pressedKeys[KeyboardKeyEnum.ArrowRight]) {
      context.cameraShiftX(shift * 0.01 / context.gameStateService.zoom);
    }
  }

  private drawPoint(context: AsciiGameComponent, scene: SceneSnapshot, x: number, y: number, cameraLeft: number, cameraTop: number) {
    const tile = scene.tiles[x][y];
    const canvasX = (x - cameraLeft) * context.tileWidth;
    const canvasY = (y - cameraTop) * context.tileHeight;
    const symbolY = canvasY + context.tileHeight * 0.7;
    context.canvasContext.fillStyle = `rgb(${tile.backgroundColor.r}, ${tile.backgroundColor.g}, ${tile.backgroundColor.b})`;
    context.canvasContext.fillRect(canvasX, canvasY, context.tileWidth + 1, context.tileHeight + 1);
    if (tile.objects.length > 0) {
      const mainObject = tile.objects.find(object => !object.passable);
      if (mainObject) {
        context.canvasContext.fillStyle = `rgba(${mainObject.sprite.color.r}, ${mainObject.sprite.color.g},
          ${mainObject.sprite.color.b}, ${mainObject.sprite.color.a})`;
        context.canvasContext.fillText(mainObject.sprite.character, canvasX, symbolY);
        return;
      }
      if (tile.objects.length > 1) {
        context.canvasContext.fillStyle = `rgba(${context.defaultManyActorsSprite.color.r},
          ${context.defaultManyActorsSprite.color.g},
          ${context.defaultManyActorsSprite.color.b},
          ${context.defaultManyActorsSprite.color.a})`;
        context.canvasContext.fillText(context.defaultManyActorsSprite.character, canvasX, symbolY);
        return;
      }
      const firstObject = tile.objects[0];
      context.canvasContext.fillStyle = `rgba(${firstObject.sprite.color.r}, ${firstObject.sprite.color.g},
        ${firstObject.sprite.color.b}, ${firstObject.sprite.color.a})`;
      context.canvasContext.fillText(firstObject.sprite.character, canvasX, symbolY);
      return;
    }
    context.canvasContext.fillStyle = `rgba(${tile.sprite.color.r}, ${tile.sprite.color.g},
      ${tile.sprite.color.b}, ${tile.sprite.color.a})`;
    context.canvasContext.fillText(tile.sprite.character, canvasX, symbolY);
  }

  private redrawScene(context: AsciiGameComponent) {
    const time = performance.now();
    const shift = time - context.lastChange;
    context.processKeys(context, shift);
    context.lastChange = time;
    if (window.devicePixelRatio !== context.gameStateService.zoom) {
      this.zoom = window.devicePixelRatio;
    }
    if (!context.changed) {
      return;
    }
    context.changed = false;
    const snapshot = context.gameStateService.scene;
    if (snapshot) {
      const cameraLeft = context.gameStateService.cameraX - context.canvasWidth / 2 / context.tileWidth + 0.5;
      const cameraTop = context.gameStateService.cameraY - context.canvasHeight / 2 / context.tileHeight + 0.5;
      context.canvasContext.clearRect(0, 0, context.canvasWidth, context.canvasHeight);
      context.canvasContext.font = `${context.tileHeight * 1}px PT Mono`;
      const left = Math.max(0, Math.floor(cameraLeft));
      const right = Math.min(snapshot.width - 1, Math.ceil(cameraLeft + context.canvasWidth / context.tileWidth));
      const top = Math.max(0, Math.floor(cameraTop));
      const bottom = Math.min(snapshot.height - 1, Math.ceil(cameraTop + context.canvasHeight / context.tileHeight));
      for (let x = left; x <= right; x++) {
        for (let y = top; y <= bottom; y++ ) {
          context.drawPoint(context, snapshot, x, y, cameraLeft, cameraTop);
        }
      }
    }
  }
}
