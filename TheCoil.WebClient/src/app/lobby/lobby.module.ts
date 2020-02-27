import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { LobbyRoutingModule } from './lobby-routing.module';
import { EmailConfirmationComponent } from './user-management/email-confirmation/email-confirmation.component';
import { LobbyComponent } from './lobby/lobby.component';
import { UserComponent } from './user-management/user/user.component';
import { EmailConfirmationResolverService } from './resolvers/email-confirmation-resolver.service';
import { SignInComponent } from './user-management/sign-in/sign-in.component';
import { SignUpComponent } from './user-management/sign-up/sign-up.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { UserManagementLoadingComponent } from './user-management/user-management-loading/user-management-loading.component';
import { ForgotPasswordComponent } from './user-management/forgot-password/forgot-password.component';
import { NewPasswordComponent } from './user-management/new-password/new-password.component';
import { UserSettingsComponent } from './user-management/user-settings/user-settings.component';
import { NewGameStartComponent } from './user-management/new-game-start/new-game-start.component';
import { UserManagementService } from './services/user-management.service';
import { UserMenuResolverService } from './resolvers/user-menu-resolver.service';
import { EmailMenuResolverService } from './resolvers/email-menu-resolver.service';
import { AuthorizationMenuResolverService } from './resolvers/authorization-menu-resolver.service';


@NgModule({
  declarations: [
    EmailConfirmationComponent,
    LobbyComponent,
    UserComponent,
    SignInComponent,
    SignUpComponent,
    UserManagementComponent,
    UserManagementLoadingComponent,
    ForgotPasswordComponent,
    NewPasswordComponent,
    UserSettingsComponent,
    NewGameStartComponent
  ],
  imports: [
    SharedModule,
    LobbyRoutingModule
  ],
  providers: [
    EmailConfirmationResolverService,
    UserManagementService,
    AuthorizationMenuResolverService,
    EmailMenuResolverService,
    UserMenuResolverService
  ]
})
export class LobbyModule { }
