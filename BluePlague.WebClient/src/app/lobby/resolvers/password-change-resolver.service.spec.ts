import { TestBed } from '@angular/core/testing';

import { PasswordChangeResolverService } from './password-change-resolver.service';

describe('PasswordChangeResolverService', () => {
  let service: PasswordChangeResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasswordChangeResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
