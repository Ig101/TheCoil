import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { GameRoutingModule } from './game-routing.module';
import { GameResolverService } from './resolvers/game-resolver.service';
import { GameStateService } from './services/game-state.service';
import { EngineModule } from '../engine/engine.module';
import { GameSettingsService } from './services/game-settings.service';
import { AsciiAnimationsRegistryService } from './services/ascii-animations-registry.service';
import { AsciiGameResolverService } from './resolvers/ascii-game-resolver.service';


@NgModule({
  imports: [
    GameRoutingModule,
    EngineModule,
    SharedModule,
  ],
  providers: [
    GameStateService,
    GameResolverService,
    GameSettingsService,
    AsciiGameResolverService,
    AsciiAnimationsRegistryService
  ]
})
export class GameModule { }
