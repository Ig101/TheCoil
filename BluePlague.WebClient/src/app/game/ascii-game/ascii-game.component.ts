import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { SceneSnapshot } from 'src/app/engine/models/scene/scene-snapshot.model';
import { EngineFacadeService } from 'src/app/engine/services/engine-facade.service';
import { GameStateService } from '../services/game-state.service';
import { EngineActionResponse } from 'src/app/engine/models/engine-action-response.model';
import { SpriteSnapshot } from 'src/app/engine/models/scene/abstract/sprite-snapshot.model';

@Component({
  selector: 'app-ascii-game',
  templateUrl: './ascii-game.component.html',
  styleUrls: ['./ascii-game.component.scss']
})
export class AsciiGameComponent implements OnInit, OnDestroy {

  @ViewChild('gameCanvas', { static: true }) gameCanvas: ElementRef<HTMLCanvasElement>;

  canvasWidth = 1120;
  canvasHeight = 630;

  private tileWidth;
  private readonly tileHeight = 40;
  private readonly defaultManyActorsSprite = {
    character: '*',
    color: {r: 255, g: 255, b: 0, a: 1}
  } as SpriteSnapshot;

  private canvasContext: CanvasRenderingContext2D;

  get sceneString(): string {
    return this.gameStateService.scene ? JSON.stringify(this.gameStateService.scene) : 'no scene';
  }

  constructor(
    private gameStateService: GameStateService,
    private engineFacadeService: EngineFacadeService) { }

  ngOnInit() {
    this.gameCanvas.nativeElement.width = this.canvasWidth;
    this.gameCanvas.nativeElement.height = this.canvasHeight;
    this.tileWidth = this.tileHeight * 0.6;
    this.canvasContext = this.gameCanvas.nativeElement.getContext('2d');
    this.engineFacadeService.loadGame()
      .subscribe(result => {
        this.gameStateService.scene = result;
        this.gameStateService.cameraX = result.player.x;
        this.gameStateService.cameraY = result.player.y;
        this.engineFacadeService.subscribeOnActionsResult(this.processNewAction, this.sceneWasDeleted);
        this.redrawScene();
      });
  }

  ngOnDestroy(): void {

  }


  processNewAction(response: EngineActionResponse) {

  }

  sceneWasDeleted() {

  }

  // Drawing
  private drawPoint(scene: SceneSnapshot, x: number, y: number, cameraLeft: number, cameraTop: number) {
    const tile = scene.tiles[x][y];
    const canvasX = (x - cameraLeft) * this.tileWidth;
    const canvasY = (y - cameraTop) * this.tileHeight;
    const symbolY = canvasY + this.tileHeight * 0.7;
    this.canvasContext.fillStyle = `rgb(${tile.backgroundColor.r}, ${tile.backgroundColor.g}, ${tile.backgroundColor.b})`;
    this.canvasContext.fillRect(canvasX, canvasY, this.tileWidth, this.tileHeight);
    if (tile.objects.length > 0) {
      const mainObject = tile.objects.find(object => !object.passable);
      if (mainObject) {
        this.canvasContext.fillStyle = `rgba(${mainObject.sprite.color.r}, ${mainObject.sprite.color.g},
          ${mainObject.sprite.color.b}, ${mainObject.sprite.color.a})`;
        this.canvasContext.fillText(mainObject.sprite.character, canvasX, symbolY);
        return;
      }
      if (tile.objects.length > 1) {
        this.canvasContext.fillStyle = `rgba(${this.defaultManyActorsSprite.color.r}, ${this.defaultManyActorsSprite.color.g},
          ${this.defaultManyActorsSprite.color.b}, ${this.defaultManyActorsSprite.color.a})`;
        this.canvasContext.fillText(this.defaultManyActorsSprite.character, canvasX, symbolY);
        return;
      }
      const firstObject = tile.objects[0];
      this.canvasContext.fillStyle = `rgba(${firstObject.sprite.color.r}, ${firstObject.sprite.color.g},
        ${firstObject.sprite.color.b}, ${firstObject.sprite.color.a})`;
      this.canvasContext.fillText(firstObject.sprite.character, canvasX, symbolY);
      return;
    }
    this.canvasContext.fillStyle = `rgba(${tile.sprite.color.r}, ${tile.sprite.color.g}, ${tile.sprite.color.b}, ${tile.sprite.color.a})`;
    this.canvasContext.fillText(tile.sprite.character, canvasX, symbolY);
  }

  private redrawScene() {
    const snapshot = this.gameStateService.scene;
    if (snapshot) {
      console.log('startWrite');
      const cameraLeft = this.gameStateService.cameraX - this.canvasWidth / 2 / this.tileWidth + 0.5;
      const cameraTop = this.gameStateService.cameraY - this.canvasHeight / 2 / this.tileHeight + 0.5;
      this.canvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.canvasContext.font = `${this.tileHeight * 1}px PT Mono`;
      const left = Math.max(0, Math.floor(cameraLeft));
      const right = Math.min(snapshot.width - 1, Math.ceil(cameraLeft + this.canvasWidth / this.tileWidth));
      const top = Math.max(0, Math.floor(cameraTop));
      const bottom = Math.min(snapshot.height - 1, Math.ceil(cameraTop + this.canvasHeight / this.tileHeight));
      console.log(left);
      console.log(right);
      console.log(top);
      console.log(bottom);
      console.log(cameraLeft);
      console.log(cameraTop);
      for (let x = left; x <= right; x++) {
        for (let y = top; y <= bottom; y++ ) {
          this.drawPoint(snapshot, x, y, cameraLeft, cameraTop);
        }
      }
    }
  }
}
