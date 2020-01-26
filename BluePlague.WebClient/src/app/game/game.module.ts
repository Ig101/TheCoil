import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameRoutingModule } from './game-routing.module';
import { SharedModule } from '../shared/shared.module';
import { EngineModule } from '../engine/engine.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    GameRoutingModule,
    SharedModule,
    EngineModule
  ]
})
export class GameModule { }
