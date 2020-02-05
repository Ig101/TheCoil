import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { AsciiGameRoutingModule } from './ascii-game-routing.module';
import { EngineModule } from 'src/app/engine/engine.module';
import { AsciiGameComponent } from './ascii-game.component';
import { ContextMenuComponent } from './context-menu/context-menu.component';
import { ContextMenuItemComponent } from './context-menu/context-menu-item/context-menu-item.component';
import { AsciiAnimationsRegistryService } from './services/ascii-animations-registry.service';



@NgModule({
  declarations: [
    AsciiGameComponent,
    ContextMenuComponent,
    ContextMenuItemComponent
  ],
  imports: [
    SharedModule,
    AsciiGameRoutingModule
  ],
  providers: [
    AsciiAnimationsRegistryService
  ]
})
export class AsciiGameModule { }
