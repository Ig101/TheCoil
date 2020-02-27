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
import { UserMenuResolverService } from './resolvers/user-menu-resolver.service';
import { AuthorizationMenuResolverService } from './resolvers/authorization-menu-resolver.service';
import { EmailMenuResolverService } from './resolvers/email-menu-resolver.service';

const loginRoutes: Routes = [
  {
    path: 'signin',
    component: SignInComponent,
    resolve: { AuthorizationMenuResolverService }
  },
  {
    path: 'signup',
    component: SignUpComponent,
    resolve: { AuthorizationMenuResolverService }
  },
  {
    path: 'signup/confirmation',
    component: EmailConfirmationComponent,
    resolve: { EmailMenuResolverService }
  },
  {
    path: 'signin/forgot-password',
    component: ForgotPasswordComponent,
    resolve: { AuthorizationMenuResolverService }
  },
  {
    path: 'signin/new-password/:id/:token',
    component: NewPasswordComponent,
    resolve: { AuthorizationMenuResolverService }
  },
  {
    path: '',
    component: UserComponent,
    resolve: { UserMenuResolverService }
  },
  {
    path: 'new',
    component: NewGameStartComponent,
    resolve: { UserMenuResolverService }
  },
  {
    path: 'settings',
    component: UserSettingsComponent,
    resolve: { UserMenuResolverService }
  },
  {
    path: 'signup/confirmation/:id/:token',
    component: SignInComponent,
    resolve: { EmailConfirmationResolverService }
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
