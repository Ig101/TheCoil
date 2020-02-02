import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AsciiGameComponent } from './ascii-game/ascii-game.component';
import { GameResolverService } from './resolvers/game-resolver.service';

const routes: Routes = [
  {path: 'ascii', component: AsciiGameComponent, resolve: { scene: GameResolverService } },
  {path: '**', redirectTo: 'ascii'}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class GameRoutingModule { }
