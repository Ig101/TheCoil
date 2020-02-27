import { TestBed } from '@angular/core/testing';

import { AsciiGameResolverService } from './ascii-game-resolver.service';

describe('AsciiGameResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AsciiGameResolverService = TestBed.inject(AsciiGameResolverService);
    expect(service).toBeTruthy();
  });
});
