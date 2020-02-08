import { TestBed } from '@angular/core/testing';

import { EngineFacadeService } from './engine-facade.service';

describe('EngineFacadeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EngineFacadeService = TestBed.inject(EngineFacadeService);
    expect(service).toBeTruthy();
  });
});
