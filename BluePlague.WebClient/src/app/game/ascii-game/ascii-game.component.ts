import { Component, OnInit } from '@angular/core';
import { SceneSnapshot } from 'src/app/engine/models/scene/scene-snapshot.model';
import { EngineFacadeService } from 'src/app/engine/services/engine-facade.service';
import { GameStateService } from '../services/game-state.service';

@Component({
  selector: 'app-ascii-game',
  templateUrl: './ascii-game.component.html',
  styleUrls: ['./ascii-game.component.scss']
})
export class AsciiGameComponent implements OnInit {

  get sceneString(): string {
    return this.gameStateService.scene ? JSON.stringify(this.gameStateService.scene) : 'no scene';
  }

  constructor(
    private gameStateService: GameStateService,
    private engineFacadeService: EngineFacadeService) { }

  ngOnInit() {
    this.engineFacadeService.loadGame()
      .subscribe(result => {
        this.gameStateService.scene = result;
      });
  }
}
