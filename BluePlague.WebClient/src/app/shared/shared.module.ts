import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebCommunicationService } from './services/web-communication.service';
import { LoadingService } from './services/loading.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    WebCommunicationService,
    LoadingService,
    RandomSource
  ],
  exports: [
    WebCommunicationService
  ]
})
export class SharedModule { }
