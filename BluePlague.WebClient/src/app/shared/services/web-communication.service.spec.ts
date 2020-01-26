import { TestBed } from '@angular/core/testing';

import { WebCommunicationService } from './web-communication.service';

describe('WebCommunicationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WebCommunicationService = TestBed.get(WebCommunicationService);
    expect(service).toBeTruthy();
  });
});
