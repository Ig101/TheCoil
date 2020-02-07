import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { GameResolverService } from './resolvers/game-resolver.service';
import { AsciiGameResolverService } from './resolvers/ascii-game-resolver.service';

const routes: Routes = [
  {path: 'ascii', loadChildren: './ascii-game/ascii-game.module#AsciiGameModule',
    resolve: { scene: GameResolverService, AsciiGameResolverService } },
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
