import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebCommunicationService } from './services/web-communication.service';
import { LoadingService } from './services/loading.service';
import { RandomService } from './services/random.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    WebCommunicationService,
    LoadingService,
    RandomService
  ]
})
export class SharedModule { }
