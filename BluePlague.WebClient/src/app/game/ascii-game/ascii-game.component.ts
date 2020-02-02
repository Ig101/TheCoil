import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { SceneSnapshot } from 'src/app/engine/models/scene/scene-snapshot.model';
import { EngineFacadeService } from 'src/app/engine/services/engine-facade.service';
import { GameStateService } from '../services/game-state.service';
import { EngineActionResponse } from 'src/app/engine/models/engine-action-response.model';
import { SpriteSnapshot } from 'src/app/engine/models/scene/abstract/sprite-snapshot.model';
import { KeyboardKeyEnum } from 'src/app/shared/models/enum/keyboard-key.enum';
import { EventManager } from '@angular/platform-browser';
import { MouseState } from 'src/app/shared/models/mouse-state.model';

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
  blocked = false;

  tileWidth = 0;
  readonly tileHeight = 60;
  readonly defaultWidth = 1080;
  readonly defaultHeight = 1080;
  readonly defaultAspectRatio = this.defaultWidth / this.defaultHeight;
  defaultManyActorsSprite = {
    character: '+',
    color: {r: 255, g: 255, b: 0, a: 1}
  } as SpriteSnapshot;
  pressedKeys: { [id: string]: boolean } = {};
  mouseState: MouseState = {
    buttons: 0,
    x: 0,
    y: 0
  };

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
        this.gameStateService.playerX = result.player.x;
        this.gameStateService.playerY = result.player.y;
        this.changed = true;
        this.engineFacadeService.subscribeOnActionsResult(this.processNewAction, this.sceneWasDeleted);
        this.drawingTimer = setInterval(this.updateCycle, 30, this);
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

  onKeyUp(event: KeyboardEvent) {
    this.pressedKeys[event.key] = false;
  }

  onMouseDown(event: MouseEvent) {
    this.mouseState.buttons = event.buttons;
  }

  onMouseUp(event: MouseEvent) {
    this.mouseState.buttons = event.buttons;
  }

  onMouseMove(event: MouseEvent) {
    this.mouseState.x = event.x;
    this.mouseState.y = event.y;
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
    if (newAspectRatio < this.defaultAspectRatio) {
      const oldWidth = this.defaultWidth;
      this.gameCanvas.nativeElement.width = oldWidth;
      this.gameCanvas.nativeElement.height = oldWidth / newAspectRatio;
    } else {
      const oldHeight = this.defaultHeight;
      this.gameCanvas.nativeElement.width = oldHeight * newAspectRatio;
      this.gameCanvas.nativeElement.height = oldHeight;
    }
    this.changed = true;
    this.redrawCycle(this);
  }

  // Drawing
  private drawPoint(scene: SceneSnapshot, x: number, y: number, cameraLeft: number, cameraTop: number) {
    const tile = scene.tiles[x][y];
    const canvasX = (x - cameraLeft) * this.tileWidth;
    const canvasY = (y - cameraTop) * this.tileHeight;
    const symbolY = canvasY + this.tileHeight * 0.7;
    if (tile.backgroundColor) {
      this.canvasContext.fillStyle = `rgb(${tile.backgroundColor.r}, ${tile.backgroundColor.g}, ${tile.backgroundColor.b})`;
      this.canvasContext.fillRect(canvasX, canvasY, this.tileWidth + 1, this.tileHeight + 1);
    }
    if (tile.objects.length > 0) {
      const mainObject = tile.objects.find(object => !object.passable);
      if (mainObject) {
        this.canvasContext.fillStyle = `rgba(${mainObject.sprite.color.r}, ${mainObject.sprite.color.g},
          ${mainObject.sprite.color.b}, ${mainObject.sprite.color.a})`;
        this.canvasContext.fillText(mainObject.sprite.character, canvasX, symbolY);
        return;
      }
      if (tile.objects.length > 1) {
        this.canvasContext.fillStyle = `rgba(${this.defaultManyActorsSprite.color.r},
          ${this.defaultManyActorsSprite.color.g},
          ${this.defaultManyActorsSprite.color.b},
          ${this.defaultManyActorsSprite.color.a})`;
        this.canvasContext.fillText(this.defaultManyActorsSprite.character, canvasX, symbolY);
        return;
      }
      const firstObject = tile.objects[0];
      this.canvasContext.fillStyle = `rgba(${firstObject.sprite.color.r}, ${firstObject.sprite.color.g},
        ${firstObject.sprite.color.b}, ${firstObject.sprite.color.a})`;
      this.canvasContext.fillText(firstObject.sprite.character, canvasX, symbolY);
      return;
    }
    if (tile.sprite) {
      this.canvasContext.fillStyle = `rgba(${tile.sprite.color.r}, ${tile.sprite.color.g},
        ${tile.sprite.color.b}, ${tile.sprite.color.a})`;
      this.canvasContext.fillText(tile.sprite.character, canvasX, symbolY);
    }
  }

  private redrawScene() {
    if (!this.changed) {
      return;
    }
    this.changed = false;
    const snapshot = this.gameStateService.scene;
    if (snapshot) {
      const cameraLeft = this.gameStateService.cameraX - this.canvasWidth / 2 / this.tileWidth + 0.5;
      const cameraTop = this.gameStateService.cameraY - this.canvasHeight / 2 / this.tileHeight + 0.5;
      this.canvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.canvasContext.font = `${this.tileHeight * 1}px PT Mono`;
      const left = Math.max(0, Math.floor(cameraLeft));
      const right = Math.min(snapshot.width - 1, Math.ceil(cameraLeft + this.canvasWidth / this.tileWidth));
      const top = Math.max(0, Math.floor(cameraTop));
      const bottom = Math.min(snapshot.height - 1, Math.ceil(cameraTop + this.canvasHeight / this.tileHeight));
      for (let x = left; x <= right; x++) {
        for (let y = top; y <= bottom; y++ ) {
          this.drawPoint(snapshot, x, y, cameraLeft, cameraTop);
        }
      }
    }
  }

  // Updating
  private processKeys(context: AsciiGameComponent, shift: number) {
    if (context.pressedKeys[KeyboardKeyEnum.ArrowDown] &&
        context.gameStateService.cameraY < context.gameStateService.scene.height - 3 &&
        context.gameStateService.cameraY - context.gameStateService.playerY < 5) {
      context.cameraShiftY(shift * 0.01);
    }
    if (context.pressedKeys[KeyboardKeyEnum.ArrowUp] &&
        context.gameStateService.cameraY > 2 &&
        context.gameStateService.cameraY - context.gameStateService.playerY > -5) {
      context.cameraShiftY(-shift * 0.01);
    }
    if (context.pressedKeys[KeyboardKeyEnum.ArrowLeft] &&
        context.gameStateService.cameraX > 5 &&
        context.gameStateService.cameraX - context.gameStateService.playerX > -15) {
      context.cameraShiftX(-shift * 0.015);
    }
    if (context.pressedKeys[KeyboardKeyEnum.ArrowRight] &&
        context.gameStateService.cameraX < context.gameStateService.scene.width - 6 &&
        context.gameStateService.cameraX - context.gameStateService.playerX < 15) {
      context.cameraShiftX(shift * 0.015);
    }
  }

  private updateScene() {
    const time = performance.now();
    const shift = time - this.lastChange;
    if (!this.blocked) {

    }
    this.processKeys(this, shift);
    this.lastChange = time;
  }

  private redrawCycle(context: AsciiGameComponent) {
    context.redrawScene();
  }

  private updateCycle(context: AsciiGameComponent) {
    context.updateScene();
    context.redrawScene();
  }
}
