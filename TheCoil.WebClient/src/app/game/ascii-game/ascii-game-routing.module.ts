import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AsciiGameComponent } from './ascii-game.component';

const routes: Routes = [
  {path: '', component: AsciiGameComponent },
  {path: '**', redirectTo: ''}
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
export class AsciiGameRoutingModule { }
