import { TestBed } from '@angular/core/testing';

import { GameResolverService } from './game-resolver.service';

describe('GameResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GameResolverService = TestBed.get(GameResolverService);
    expect(service).toBeTruthy();
  });
});
