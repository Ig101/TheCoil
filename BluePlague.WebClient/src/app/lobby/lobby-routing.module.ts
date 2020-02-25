import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LobbyComponent } from './lobby/lobby.component';
import { EmailConfirmationResolverService } from './resolvers/email-confirmation-resolver.service';
import { UserResolverService } from '../shared/resolvers/user-resolver.service';
import { SignInComponent } from './user-management/sign-in/sign-in.component';
import { SignUpComponent } from './user-management/sign-up/sign-up.component';
import { EmailConfirmationComponent } from './user-management/email-confirmation/email-confirmation.component';
import { ForgotPasswordComponent } from './user-management/forgot-password/forgot-password.component';
import { NewGameStartComponent } from './user-management/new-game-start/new-game-start.component';
import { NewPasswordComponent } from './user-management/new-password/new-password.component';
import { UserComponent } from './user-management/user/user.component';
import { UserSettingsComponent } from './user-management/user-settings/user-settings.component';

const loginRoutes: Routes = [
  {
    path: 'signin',
    component: SignInComponent
  },
  {
    path: 'signup',
    component: SignUpComponent
  },
  {
    path: 'signup/confirmation',
    component: EmailConfirmationComponent
  },
  {
    path: 'signin/forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'signin/new-password/:id/:token',
    component: NewPasswordComponent
  },
  {
    path: '',
    component: UserComponent
  },
  {
    path: 'new',
    component: NewGameStartComponent
  },
  {
    path: 'settings',
    component: UserSettingsComponent
  }
];

const routes: Routes = [
  {
    path: '',
    component: LobbyComponent,
    resolve: { user: UserResolverService },
    children: loginRoutes
  },
  {
    path: 'signup/confirmation/:id/:token',
    redirectTo: '',
    resolve: { emailConfirmed: EmailConfirmationResolverService }
  },
  {
    path: '**',
    redirectTo: ''
  }
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
