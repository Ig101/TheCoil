import { TestBed } from '@angular/core/testing';

import { AuthorizationMenuResolverService } from './authorization-menu-resolver.service';

describe('AuthorizationMenuResolverService', () => {
  let service: AuthorizationMenuResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthorizationMenuResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
