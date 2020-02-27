import { TestBed } from '@angular/core/testing';

import { EmailConfirmationResolverService } from './email-confirmation-resolver.service';

describe('EmailConfirmationResolverService', () => {
  let service: EmailConfirmationResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailConfirmationResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
