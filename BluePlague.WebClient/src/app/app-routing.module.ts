import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path: 'game', loadChildren: () => import('./game/game.module').then(x => x.GameModule) },
  {path: 'lobby', loadChildren: () => import('./lobby/lobby.module').then(x => x.LobbyModule) },
  {path: '**', redirectTo: 'lobby'}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
