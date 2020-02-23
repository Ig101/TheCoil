import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebCommunicationService } from './services/web-communication.service';
import { LoadingService } from './services/loading.service';
import { RandomService } from './services/random.service';
import { ModalShellComponent } from './modal/modal-shell/modal-shell.component';
import { ModalService } from './services/modal.service';
import { ModalComponentFactory } from './modal/modal-component-factory';
import { UserResolverService } from './resolvers/user-resolver.service';
import { UserService } from './services/user.service';
import { ReactiveFormsModule } from '@angular/forms';
import { TextInputComponent } from './components/text-input/text-input.component';
@NgModule({
  declarations: [ModalShellComponent, TextInputComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  providers: [
    WebCommunicationService,
    LoadingService,
    RandomService,
    ModalService,
    ModalComponentFactory,
    UserResolverService,
    UserService
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    ModalShellComponent,
    TextInputComponent
  ]
})
export class SharedModule { }
