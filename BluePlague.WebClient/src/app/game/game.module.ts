import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameRoutingModule } from './game-routing.module';
import { SharedModule } from '../shared/shared.module';
import { EngineModule } from '../engine/engine.module';
import { AsciiGameComponent } from './ascii-game/ascii-game.component';
import { GameStateService } from './services/game-state.service';
import { ContextMenuComponent } from './ascii-game/context-menu/context-menu.component';
import { GameResolverService } from './resolvers/game-resolver.service';
import { ContextMenuItemComponent } from './ascii-game/context-menu/context-menu-item/context-menu-item.component';



@NgModule({
  declarations: [
    AsciiGameComponent,
    ContextMenuComponent,
    ContextMenuItemComponent
  ],
  imports: [
    GameRoutingModule,
    SharedModule,
    EngineModule,
  ],
  providers: [
    GameStateService,
    GameResolverService
  ]
})
export class GameModule { }
