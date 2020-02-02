import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { SceneSnapshot } from 'src/app/engine/models/scene/scene-snapshot.model';
import { EngineFacadeService } from 'src/app/engine/services/engine-facade.service';
import { GameStateService } from '../services/game-state.service';
import { EngineActionResponse } from 'src/app/engine/models/engine-action-response.model';
import { SpriteSnapshot } from 'src/app/engine/models/scene/abstract/sprite-snapshot.model';
import { KeyboardKeyEnum } from 'src/app/shared/models/enum/keyboard-key.enum';
import { EventManager } from '@angular/platform-browser';
import { MouseState } from 'src/app/shared/models/mouse-state.model';
import { ContextMenuContext } from '../models/context-menu-context.model';
import { ActivatedRoute } from '@angular/router';
import { ContextMenuItem } from '../models/context-menu-item.model';

@Component({
  selector: 'app-ascii-game',
  templateUrl: './ascii-game.component.html',
  styleUrls: ['./ascii-game.component.scss', '../game.module.scss']
})
export class AsciiGameComponent implements OnInit, OnDestroy {

  @ViewChild('gameCanvas', { static: true }) gameCanvas: ElementRef<HTMLCanvasElement>;
  private canvasContext: CanvasRenderingContext2D;

  contextMenu: ContextMenuContext;
  contextX: number;
  contextY: number;

  lastChange: number;

  drawingTimer;
  changed = false;
  blocked = false;

  tileWidth = 0;
  tileHeight = 30;
  readonly defaultWidth = 1080;
  readonly defaultHeight = 1080;
  readonly defaultAspectRatio = this.defaultWidth / this.defaultHeight;
  zoom = 0;
  defaultManyActorsSprite = {
    character: '+',
    color: {r: 255, g: 255, b: 0, a: 1}
  } as SpriteSnapshot;
  pressedKeys: { [id: string]: boolean } = {};
  mouseState: MouseState = {
    buttonsInfo: {},
    x: -1,
    y: -1,
    realX: -1,
    realY: -1
  };

  get canvasWidth() {
    return this.gameCanvas.nativeElement.width;
  }

  get canvasHeight() {
    return this.gameCanvas.nativeElement.height;
  }

  get cameraX() {
    return this.gameStateService.cameraX;
  }

  set cameraX(value: number) {
    const leftSide = this.defaultWidth / this.tileWidth / 2 - 1;
    if (value < leftSide) {
      this.gameStateService.cameraX = leftSide;
      return;
    }
    const rightSide = this.gameStateService.scene.width - this.defaultWidth / this.tileWidth / 2;
    if (value > rightSide) {
      this.gameStateService.cameraX = rightSide;
      return;
    }
    this.gameStateService.cameraX = value;
  }

  get cameraY() {
    return this.gameStateService.cameraY;
  }

  set cameraY(value: number) {
    const topSide = this.defaultHeight / this.tileHeight / 2 - 3;
    if (value < topSide) {
      this.gameStateService.cameraY = topSide;
      return;
    }
    const bottomSide = this.gameStateService.scene.height - this.defaultHeight / this.tileHeight / 2 + 2;
    if (value > bottomSide) {
      this.gameStateService.cameraY = bottomSide;
      return;
    }
    this.gameStateService.cameraY = value;
  }

  constructor(
    private gameStateService: GameStateService,
    private engineFacadeService: EngineFacadeService,
    private activatedRoute: ActivatedRoute) {
      this.mouseState.buttonsInfo[0] = {
        pressed: false,
        timeStamp: 0
      };
      this.mouseState.buttonsInfo[2] = {
        pressed: false,
        timeStamp: 0
      };
    }

  ngOnInit() {
    this.tileWidth = this.tileHeight * 0.6;
    this.setupAspectRatio(this.gameCanvas.nativeElement.offsetWidth, this.gameCanvas.nativeElement.offsetHeight);
    this.canvasContext = this.gameCanvas.nativeElement.getContext('2d');
    const scene = this.activatedRoute.snapshot.data.scene;
    this.gameStateService.scene = scene;
    this.cameraX = scene.player.x;
    this.cameraY = scene.player.y;
    this.changed = true;
    this.engineFacadeService.subscribeOnActionsResult(this.processNewAction, this.sceneWasDeleted);
    this.drawingTimer = setInterval(this.updateCycle, 30, this);
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
    this.mouseState.buttonsInfo[event.button] = {pressed: true, timeStamp: event.timeStamp};
  }

  onMouseUp(event: MouseEvent) {
    this.mouseState.buttonsInfo[event.button] = {pressed: false, timeStamp: 0};
    this.recalculateMouseMove(event.x, event.y, event.timeStamp);
    if (event.button === 2) {
      const x = Math.floor(this.mouseState.x);
      const y = Math.floor(this.mouseState.y);
      const actions = this.engineFacadeService.validateAndGetAllActions(x, y);
      this.blocked = true;
      this.contextX = (x - this.gameStateService.cameraX + this.canvasWidth / 2 / this.tileWidth + 1) * this.zoom * this.tileWidth;
      this.contextY = (y - this.gameStateService.cameraY + this.canvasHeight / 2 / this.tileHeight - 1) * this.zoom * this.tileHeight;
      this.contextMenu = {
        targetX: x,
        targetY: y,
        actions
      };
    }
  }

  private recalculateMouseMove(x: number, y: number, timeStamp?: number) {
    const leftKey = this.mouseState.buttonsInfo[0];
    const rightKey = this.mouseState.buttonsInfo[2];
    const cameraLeft = this.gameStateService.cameraX - this.canvasWidth / 2 / this.tileWidth + 0.5;
    const cameraTop = this.gameStateService.cameraY - this.canvasHeight / 2 / this.tileHeight + 0.5;
    const newX = x / this.zoom / this.tileWidth + cameraLeft;
    const newY = y / this.zoom / this.tileHeight + cameraTop;
    if (leftKey.pressed && timeStamp && timeStamp - leftKey.timeStamp > 100) {
      this.cameraMouseShift(this.mouseState.x - newX, this.mouseState.y - newY);
    } else if (!rightKey.pressed) {
      this.mouseState.x = newX;
      this.mouseState.y = newY;
      this.changed = true;
    }
  }

  onMouseMove(event: MouseEvent) {
    this.mouseState.realX = event.x;
    this.mouseState.realY = event.y;
    if (!this.blocked) {
      this.recalculateMouseMove(event.x, event.y, event.timeStamp);
    }
  }

  @HostListener('contextmenu', ['$event'])
  onContextMenu(event) {
    event.preventDefault();
  }

  cameraMouseShift(xShift: number, yShift: number) {
    this.cameraX += xShift;
    this.cameraY += yShift;
    this.changed = true;
  }

  doAction(action: ContextMenuItem) {
    this.contextMenu = undefined;
    console.log(action);
    if (action) {

    } else {
      this.blocked = false;
    }
  }

  processNewAction(response: EngineActionResponse) {
    console.log(response);
    this.changed = true;
  }

  sceneWasDeleted() {
    this.engineFacadeService.subscribeOnActionsResult(this.processNewAction);
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
    this.zoom = this.gameCanvas.nativeElement.offsetWidth / this.canvasWidth;
    if (this.contextMenu) {
      this.contextX = (Math.floor(this.mouseState.x) - this.gameStateService.cameraX + this.canvasWidth / 2 /
        this.tileWidth + 1) * this.zoom * this.tileWidth;
      this.contextY = (Math.floor(this.mouseState.y) - this.gameStateService.cameraY + this.canvasHeight / 2 /
        this.tileHeight - 1) * this.zoom * this.tileHeight;
    }
    this.changed = true;
    this.redrawCycle(this);
  }

  // Drawing
  private brightImpact(bright: boolean, color: {r: number, g: number, b: number, a: number}) {
    if (bright) {
      return {
        r: color.r * 0.2,
        g: color.g * 0.2,
        b: color.b * 0.2,
        a: color.a
      };
    }
    return color;
  }

  private drawPoint(scene: SceneSnapshot, x: number, y: number, cameraLeft: number, cameraTop: number, mouseX: number, mouseY: number):
    {canvasX: number, canvasY: number, bright: boolean} {
    const tile = scene.tiles[x][y];
    if (tile.sprite) {
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
          const color = this.brightImpact(tile.bright, mainObject.sprite.color);
          this.canvasContext.fillStyle = `rgba(${color.r},${color.g},${color.b},${color.a})`;
          this.canvasContext.fillText(mainObject.sprite.character, canvasX, symbolY);
        } else if (tile.objects.length > 1) {
          const color = this.brightImpact(tile.bright, this.defaultManyActorsSprite.color);
          this.canvasContext.fillStyle = `rgba(${color.r},${color.g},${color.b},${color.a})`;
          this.canvasContext.fillText(this.defaultManyActorsSprite.character, canvasX, symbolY);
        } else {
          const firstObject = tile.objects[0];
          const color = this.brightImpact(tile.bright, firstObject.sprite.color);
          this.canvasContext.fillStyle = `rgba(${color.r},${color.g},${color.b},${color.a})`;
          this.canvasContext.fillText(firstObject.sprite.character, canvasX, symbolY);
        }
      } else {
          this.canvasContext.fillStyle = `rgba(${tile.sprite.color.r}, ${tile.sprite.color.g},
            ${tile.sprite.color.b}, ${tile.sprite.color.a})`;
          this.canvasContext.fillText(tile.sprite.character, canvasX, symbolY);
      }
      if (mouseX === x && mouseY === y) {
        return {canvasX, canvasY, bright: tile.bright};
      }
    }
    return undefined;
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
      this.canvasContext.font = `${this.tileHeight}px PT Mono`;
      const left = Math.max(0, Math.floor(cameraLeft));
      const right = Math.min(snapshot.width - 1, Math.ceil(cameraLeft + this.canvasWidth / this.tileWidth));
      const top = Math.max(0, Math.floor(cameraTop));
      const bottom = Math.min(snapshot.height - 1, Math.ceil(cameraTop + this.canvasHeight / this.tileHeight));
      const mouseX = Math.floor(this.mouseState.x);
      const mouseY = Math.floor(this.mouseState.y);
      let currentTile;
      for (let x = left; x <= right; x++) {
        for (let y = top; y <= bottom; y++ ) {
          const temp = this.drawPoint(snapshot, x, y, cameraLeft, cameraTop, mouseX, mouseY);
          if (temp && !currentTile) {
            currentTile = temp;
          }
        }
      }
      if (currentTile) {
        const playerColor = this.brightImpact(currentTile.bright, this.gameStateService.scene.player.sprite.color);
        this.canvasContext.strokeStyle = `rgba(${playerColor.r}, ${playerColor.g}, ${playerColor.b}, 0.4)`;
        this.canvasContext.lineWidth = 2;
        this.canvasContext.strokeRect(currentTile.canvasX + 2, currentTile.canvasY + 2, this.tileWidth - 2, this.tileHeight - 2);
      }
    }
  }

  // Updating
  private processKeys(context: AsciiGameComponent, shift: number) {

  }

  private updateScene() {
    const time = performance.now();
    const shift = time - this.lastChange;
    this.lastChange = time;
    if (!this.blocked) {
      this.processKeys(this, shift);
    }
  }

  private redrawCycle(context: AsciiGameComponent) {
    context.redrawScene();
  }

  private updateCycle(context: AsciiGameComponent) {
    context.updateScene();
    context.redrawScene();
  }
}
