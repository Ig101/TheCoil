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


@NgModule({
  declarations: [
    EmailConfirmationComponent,
    LobbyComponent,
    UserComponent,
    SignInComponent,
    SignUpComponent,
    UserManagementComponent,
    UserManagementLoadingComponent
  ],
  imports: [
    SharedModule,
    LobbyRoutingModule
  ],
  providers: [
    EmailConfirmationResolverService
  ]
})
export class LobbyModule { }
