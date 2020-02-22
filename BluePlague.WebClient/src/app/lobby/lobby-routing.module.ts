import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LobbyComponent } from './lobby/lobby.component';
import { EmailConfirmationResolverService } from './resolvers/email-confirmation-resolver.service';
import { UserResolverService } from '../shared/resolvers/user-resolver.service';

const routes: Routes = [
  {path: '', component: LobbyComponent, resolve: { user: UserResolverService } },
  {path: 'confirmation/:id/:token', redirectTo: '', resolve: { confirmed: EmailConfirmationResolverService } },
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
export class LobbyRoutingModule { }
