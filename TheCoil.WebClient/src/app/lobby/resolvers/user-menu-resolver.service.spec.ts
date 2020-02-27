import { TestBed } from '@angular/core/testing';

import { UserMenuResolverService } from './user-menu-resolver.service';

describe('UserMenuResolverService', () => {
  let service: UserMenuResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserMenuResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
