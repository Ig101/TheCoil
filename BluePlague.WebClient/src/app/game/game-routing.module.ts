import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AsciiGameComponent } from './ascii-game/ascii-game.component';

const routes: Routes = [
  {path: 'ascii', component: AsciiGameComponent },
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
