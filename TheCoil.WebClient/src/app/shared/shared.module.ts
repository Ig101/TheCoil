import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebCommunicationService } from './services/web-communication.service';
import { LoadingService } from './services/loading.service';
import { ModalShellComponent } from './modal/modal-shell/modal-shell.component';
import { ModalService } from './services/modal.service';
import { ModalComponentFactory } from './modal/modal-component-factory';
import { UserResolverService } from './resolvers/user-resolver.service';
import { UserService } from './services/user.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TextInputComponent } from './components/text-input/text-input.component';
import { ButtonComponent } from './components/button/button.component';
import { LinkComponent } from './components/link/link.component';
import { FocusRemoverDirective } from './components/directives/focus-remover.directive';
@NgModule({
  declarations: [ModalShellComponent, TextInputComponent, ButtonComponent, LinkComponent, FocusRemoverDirective],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    WebCommunicationService,
    LoadingService,
    ModalService,
    ModalComponentFactory,
    UserResolverService,
    UserService
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ModalShellComponent,
    TextInputComponent,
    ButtonComponent,
    LinkComponent,
    FocusRemoverDirective
  ]
})
export class SharedModule { }
