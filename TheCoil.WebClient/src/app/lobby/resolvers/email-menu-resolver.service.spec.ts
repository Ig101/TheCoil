import { TestBed } from '@angular/core/testing';

import { EmailMenuResolverService } from './email-menu-resolver.service';

describe('EmailMenuResolverService', () => {
  let service: EmailMenuResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailMenuResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
