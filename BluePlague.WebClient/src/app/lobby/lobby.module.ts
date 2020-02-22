import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { LobbyRoutingModule } from './lobby-routing.module';
import { EmailConfirmationComponent } from './user-management/email-confirmation/email-confirmation.component';
import { EmailConfirmedComponent } from './user-management/email-confirmed/email-confirmed.component';
import { LobbyComponent } from './lobby/lobby.component';
import { LoginComponent } from './user-management/login/login.component';
import { RegisterComponent } from './user-management/register/register.component';
import { UserComponent } from './user-management/user/user.component';


@NgModule({
  declarations: [
    EmailConfirmationComponent,
    EmailConfirmedComponent,
    LobbyComponent,
    LoginComponent,
    RegisterComponent,
    UserComponent
  ],
  imports: [
    SharedModule,
    LobbyRoutingModule
  ],
  providers: [
  ]
})
export class LobbyModule { }
