import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { SceneSnapshot } from 'src/app/engine/models/scene/scene-snapshot.model';
import { EngineFacadeService } from 'src/app/engine/services/engine-facade.service';
import { GameStateService } from '../services/game-state.service';
import { EngineActionResponse } from 'src/app/engine/models/engine-action-response.model';
import { KeyboardKeyEnum } from 'src/app/shared/models/enum/keyboard-key.enum';
import { EventManager } from '@angular/platform-browser';
import { MouseState } from 'src/app/shared/models/mouse-state.model';
import { ContextMenuContext } from './models/context-menu-context.model';
import { ActivatedRoute } from '@angular/router';
import { ContextMenuItem } from './models/context-menu-item.model';
import { EnginePlayerActionFull } from 'src/app/engine/models/engine-player-action-full.model';
import { AnimationItem } from './models/animation-item.model';
import { ReactionResult } from 'src/app/engine/scene/models/reaction-result.model';
import { SceneChanges } from 'src/app/engine/models/scene/scene-changes.model';
import { KeyState } from '../models/key-state.model';
import { GameSettingsService } from '../services/game-settings.service';
import { ReactionMessageLevelEnum } from 'src/app/engine/models/enums/reaction-message-level.enum';
import { AsciiAnimationsRegistryService } from '../services/ascii-animations-registry.service';
import { LogItem } from './models/log-item.model';
import { Subject, BehaviorSubject, Subscription } from 'rxjs';
import { AnimationTileReplacement } from './models/animation-tile-replacement.model';
import { timestamp } from 'rxjs/operators';
import { VisualizationSnapshot } from 'src/app/engine/models/scene/abstract/visualization-snapshot.model';

@Component({
  selector: 'app-ascii-game',
  templateUrl: './ascii-game.component.html',
  styleUrls: ['./ascii-game.component.scss']
})
export class AsciiGameComponent implements OnInit, OnDestroy {

  @ViewChild('gameCanvas', { static: true }) gameCanvas: ElementRef<HTMLCanvasElement>;
  private canvasContext: CanvasRenderingContext2D;

  private metaSubscription: Subscription;

  contextMenu: ContextMenuContext;
  contextX: number;
  contextY: number;

  lastChange: number;

  drawingTimer;
  drawingFrequency = 30;
  changed = false;
  blocked = false;
  mouseBlocked = false;

  tileWidth = 0;
  tileHeight = 30;
  readonly defaultWidth = 1180;
  readonly defaultHeight = 1080;
  readonly defaultAspectRatio = this.defaultWidth / this.defaultHeight;
  zoom = 0;
  defaultManyActorsSprite = {
    character: '+',
    description: $localize`:@@game.manyActors:A plenty of things.`,
    color: {r: 255, g: 255, b: 0, a: 1}
  } as VisualizationSnapshot;
  pressedKey: KeyState;
  mouseState: MouseState = {
    buttonsInfo: {},
    x: -1,
    y: -1,
    realX: -1,
    realY: -1
  };

  firstAnimation = false;
  animationsLoaded = false;
  animationTimer;
  animationFrequency = 60;
  animationsQueue: AnimationItem[] = [];
  animationReplacements: AnimationTileReplacement[];

  log: LogItem[] = [];
  logSubject = new BehaviorSubject<LogItem[]>(this.log);

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
    /*const leftSide = this.defaultWidth / this.tileWidth / 2 - 3;
    if (value < leftSide) {
      this.gameStateService.cameraX = leftSide;
      return;
    }
    const rightSide = this.gameStateService.scene.width - this.defaultWidth / this.tileWidth / 2 + 2;
    if (value > rightSide) {
      this.gameStateService.cameraX = rightSide;
      return;
    }*/
    this.gameStateService.cameraX = value;
  }

  get cameraY() {
    return this.gameStateService.cameraY;
  }

  set cameraY(value: number) {
    /*const topSide = this.defaultHeight / this.tileHeight / 2 - 7;
    if (value < topSide) {
      this.gameStateService.cameraY = topSide;
      return;
    }
    const bottomSide = this.gameStateService.scene.height - this.defaultHeight / this.tileHeight / 2 + 1;
    if (value > bottomSide) {
      this.gameStateService.cameraY = bottomSide;
      return;
    }*/
    this.gameStateService.cameraY = value;
  }

  constructor(
    private gameStateService: GameStateService,
    private engineFacadeService: EngineFacadeService,
    private activatedRoute: ActivatedRoute,
    private gameSettingsService: GameSettingsService,
    private asciiAnimationsRegistryService: AsciiAnimationsRegistryService) {
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
    this.metaSubscription = this.engineFacadeService.subscribeOnMetaInformationChange(value => {
      // TODO translate meta change for endturn
    });
    this.tileWidth = this.tileHeight * 0.6;
    this.setupAspectRatio(this.gameCanvas.nativeElement.offsetWidth, this.gameCanvas.nativeElement.offsetHeight);
    this.canvasContext = this.gameCanvas.nativeElement.getContext('2d');
    const scene = this.activatedRoute.snapshot.data.scene;
    this.gameStateService.scene = scene;
    this.cameraX = scene.player.x;
    this.cameraY = scene.player.y;
    this.changed = true;
    this.engineFacadeService.subscribeOnActionsResult(
      (result) => this.processNewAction(result),
      () => this.sceneWasDeleted());
    this.drawingTimer = setInterval(this.updateCycle, this.drawingFrequency, this);
    this.animationTimer = setInterval(this.playAnimationCycle, this.animationFrequency, this);
  }

  ngOnDestroy(): void {
    clearInterval(this.drawingTimer);
    this.metaSubscription.unsubscribe();
  }

  onResize(event) {
    this.setupAspectRatio(event.target.innerWidth, event.target.innerHeight);
  }

  onKeyDown(event: KeyboardEvent) {
    const action = this.gameSettingsService.smartActionsKeyBindings[event.key];
    if (action && !this.blocked) {
      const thisAction = this.pressedKey && this.pressedKey.action === action;
      if (thisAction && this.pressedKey.pressedTime > 0) {
        return;
      }
      if (!thisAction) {
        this.pressedKey = {
          pressedTime: 120,
          action,
          key: event.key
        };
      } else {
        this.pressedKey.pressedTime = 120;
      }
      const x = this.pressedKey.action.xShift + this.gameStateService.playerX;
      const y = this.pressedKey.action.yShift + this.gameStateService.playerY;
      const validation = this.engineFacadeService.validateSmartAction(x, y);
      if (validation.success) {
        this.doSmartAction(x, y);
      } else if (validation.reason) {
        for (const logItem of this.log) {
          logItem.expiring = true;
        }
        this.drawAnimationMessage({
          level: ReactionMessageLevelEnum.Information,
          message: validation.reason
        });
      }
    }
    if (action) {
    }
  }

  onKeyUp(event: KeyboardEvent) {
    if (this.pressedKey && this.pressedKey.key === event.key) {
      this.pressedKey = undefined;
    }
  }

  onMouseDown(event: MouseEvent) {
    this.mouseState.buttonsInfo[event.button] = {pressed: true, timeStamp: event.timeStamp};
  }

  onMouseUp(event: MouseEvent) {
    this.mouseState.buttonsInfo[event.button] = {pressed: false, timeStamp: 0};
    if (!this.blocked) {
      this.recalculateMouseMove(event.x, event.y, event.timeStamp);
      if (event.button === 2) {
        const x = Math.floor(this.mouseState.x);
        const y = Math.floor(this.mouseState.y);
        if (x < this.gameStateService.scene.width && y < this.gameStateService.scene.height && x >= 0 && y >= 0 &&
            this.gameStateService.scene.tiles[x][y]) {
          const actions = this.engineFacadeService.validateAndGetAllActions(x, y);
          this.blocked = true;
          this.mouseBlocked = true;
          this.contextX = (x - this.gameStateService.cameraX + this.canvasWidth / 2 / this.tileWidth) * this.zoom * this.tileWidth;
          this.contextY = (y - this.gameStateService.cameraY + this.canvasHeight / 2 / this.tileHeight) * this.zoom * this.tileHeight;
          const tile = this.gameStateService.scene.tiles[x][y];
          let targetName;
          if (tile.objects.length > 0) {
            const mainObject = tile.objects.find(object => !object.passable);
            if (mainObject) {
              targetName = mainObject.name;
            } else if (tile.objects.length > 1) {
              targetName = tile.objects[0].name;
            } else {
              targetName = 'plenty';
            }
          } else {
            targetName = tile.name;
          }
          this.contextMenu = {
            actions,
            targetName
          };
        }
      }
    }
  }

  onMouseLeave() {
    for (const state of Object.values(this.mouseState.buttonsInfo)) {
      state.pressed = false;
      state.timeStamp = 0;
    }
  }

  private recalculateMouseMove(x: number, y: number, timeStamp?: number) {
    const leftKey = this.mouseState.buttonsInfo[0];
    const rightKey = this.mouseState.buttonsInfo[2];
    if (!rightKey.pressed && !leftKey.pressed) {
      const cameraLeft = this.gameStateService.cameraX - this.canvasWidth / 2 / this.tileWidth + 0.5;
      const cameraTop = this.gameStateService.cameraY - this.canvasHeight / 2 / this.tileHeight + 0.5;
      const newX = x / this.zoom / this.tileWidth + cameraLeft;
      const newY = y / this.zoom / this.tileHeight + cameraTop;
      this.mouseState.x = newX;
      this.mouseState.y = newY;
      this.changed = true;
    }
  }

  onMouseMove(event: MouseEvent) {
    this.mouseState.realX = event.x;
    this.mouseState.realY = event.y;
    if (!this.mouseBlocked) {
      this.recalculateMouseMove(event.x, event.y, event.timeStamp);
    }
  }

  @HostListener('contextmenu', ['$event'])
  onContextMenu(event) {
    event.preventDefault();
  }

  cameraShift(xShift: number, yShift: number) {
    this.mouseState.x += xShift;
    this.mouseState.y += yShift;
    this.cameraX += xShift;
    this.cameraY += yShift;
    this.changed = true;
  }

  doAction(action: EnginePlayerActionFull) {
    this.contextMenu = undefined;
    this.mouseBlocked = false;
    if (action) {
      // const time = performance.now();
      this.firstAnimation = true;
      this.engineFacadeService.sendActions([action]);
      this.recalculateMouseMove(this.mouseState.realX, this.mouseState.realY);
      this.animationsLoaded = true;
      // console.log(performance.now() - time);
    } else {
      this.blocked = false;
    }
  }

  doSmartAction(x: number, y: number) {
    // const time = performance.now();
    this.blocked = true;
    this.firstAnimation = true;
    this.engineFacadeService.sendSmartAction(x, y);
    this.animationsLoaded = true;
    // console.log(performance.now() - time);
  }

  processNewAction(response: EngineActionResponse) {
    for (const tile of response.changes.replacedTiles) {
      this.gameStateService.scene.tiles[tile.x][tile.y] = tile;
    }
    for (const tile of response.changes.removedTiles) {
      this.gameStateService.scene.tiles[tile.x][tile.y] = undefined;
    }
    this.animationsQueue.push(...this.asciiAnimationsRegistryService.getAnimations(response));
    if (this.firstAnimation) {
      this.firstAnimation = false;
      for (const logItem of this.log) {
        logItem.expiring = true;
      }
      this.playAnimation();
    }
  }

  private endAction() {
    this.blocked = false;
    this.animationsLoaded = false;
    // TODO process status change
  }

  private drawAnimationMessage(message: ReactionResult) {
    let info: {
      color: string;
    };
    switch (message.level) {
      case ReactionMessageLevelEnum.Information:
        info = {
          color: '#fff'
        };
        break;
      case ReactionMessageLevelEnum.Attention:
        info = {
          color: '#ff0'
        };
        break;
    }
    if (info) {
      this.log.push({
        opacity: 3,
        color: info.color,
        message: message.message,
        expiring: false
      });
    }
  }

  private updateSnapshot(changes: SceneChanges) {
    this.gameStateService.scene.turn = changes.turn;
    for (const tile of changes.changedTiles) {
      const snapshotTile = this.gameStateService.scene.tiles[tile.x][tile.y];
      snapshotTile.name = tile.name;
      snapshotTile.sprite = tile.sprite;
      snapshotTile.backgroundColor = tile.backgroundColor;
      snapshotTile.tags = tile.tags;
      snapshotTile.passable = tile.passable;
    }
    for (const deletedActor of changes.deletedActors) {
      const snapshotTile = this.gameStateService.scene.tiles[deletedActor.x][deletedActor.y];
      const index = snapshotTile.objects.findIndex(x => x.id === deletedActor.id);
      if (index >= 0) {
        snapshotTile.objects.splice(index, 1);
      }
    }
    for (const actor of changes.changedActors) {
      const snapshotTile = this.gameStateService.scene.tiles[actor.x][actor.y];
      const snapshotActorId = snapshotTile.objects.findIndex(x => x.id === actor.id);
      if (snapshotActorId >= 0) {
        snapshotTile.objects[snapshotActorId] = actor;
      } else {
        snapshotTile.objects.push(actor);
      }
      if (actor.id === this.gameStateService.scene.player.id) {
        const oldX = this.gameStateService.playerX;
        const oldY = this.gameStateService.playerY;
        this.gameStateService.scene.player = actor;
        const newX = this.gameStateService.playerX;
        const newY = this.gameStateService.playerY;
        if (Math.abs(oldX - this.gameStateService.cameraX) <= 3 && Math.abs(oldY - this.gameStateService.cameraY) <= 3) {
          this.cameraShift(newX - oldX, newY - oldY);
        }
      }
    }
    this.changed = true;
  }

  playAnimation() {
    if (this.animationReplacements) {
      this.changed = true;
    }
    this.animationReplacements = undefined;
    let timed = false;
    while (this.animationsQueue.length > 0 && !timed) {
      const animation = this.animationsQueue.shift();
      if (animation.message) {
        this.drawAnimationMessage(animation.message);
      }
      if (animation.snapshotChanges) {
        this.updateSnapshot(animation.snapshotChanges);
      }
      if (animation.overlay) {
        timed = true;
        this.animationReplacements = animation.overlay;
        this.changed = true;
      }
    }
    if (this.animationsQueue.length === 0 && this.animationsLoaded && this.blocked) {
      this.endAction();
    }
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
        this.tileWidth) * this.zoom * this.tileWidth;
      this.contextY = (Math.floor(this.mouseState.y) - this.gameStateService.cameraY + this.canvasHeight / 2 /
        this.tileHeight) * this.zoom * this.tileHeight;
    }
    this.changed = true;
    this.redrawScene();
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
    if (tile) {
      const canvasX = (x - cameraLeft) * this.tileWidth;
      const canvasY = (y - cameraTop) * this.tileHeight;
      const symbolY = canvasY + this.tileHeight * 0.7;
      if (tile.backgroundColor) {
        this.canvasContext.fillStyle = `rgb(${tile.backgroundColor.r}, ${tile.backgroundColor.g}, ${tile.backgroundColor.b})`;
        this.canvasContext.fillRect(canvasX, canvasY, this.tileWidth + 1, this.tileHeight + 1);
      }
      let replacement;
      if (this.animationReplacements) {
        replacement = this.animationReplacements.find(o => o.x === x && o.y === y);
      }
      if (replacement) {
        const color = this.brightImpact(tile.bright, replacement.color);
        this.canvasContext.fillStyle = `rgba(${color.r},${color.g},${color.b},${color.a})`;
        this.canvasContext.fillText(replacement.character, canvasX, symbolY);
      } else if (tile.objects.length > 0) {
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
  private processKeys(shift: number) {
    if (this.pressedKey) {
      this.pressedKey.pressedTime -= shift;
    }
  }

  private updateScene() {
    const time = performance.now();
    const shift = time - this.lastChange;
    this.lastChange = time;
    this.processKeys(shift);
    for (let i = 0; i < this.log.length; i++) {
      const logItem = this.log[i];
      if (logItem.expiring) {
        logItem.opacity -= 0.0005 * shift;
        if (logItem.opacity <= 0) {
          this.log.splice(i, 1);
          i--;
        }
      }
    }
    this.logSubject.next(this.log);
  }

  private updateCycle(context: AsciiGameComponent) {
    context.updateScene();
    context.redrawScene();
  }

  private playAnimationCycle(context: AsciiGameComponent) {
    context.playAnimation();
  }
}
