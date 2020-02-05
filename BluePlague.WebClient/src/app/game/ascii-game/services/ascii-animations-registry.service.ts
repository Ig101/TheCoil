import { Injectable } from '@angular/core';
import { WebCommunicationService } from 'src/app/shared/services/web-communication.service';

@Injectable()
export class AsciiAnimationsRegistryService {

  constructor(
    private webCommunicationService: WebCommunicationService
  ) { }
}
