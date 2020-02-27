import { TestBed } from '@angular/core/testing';

import { AsciiAnimationsRegistryService } from './ascii-animations-registry.service';

describe('AsciiAnimationsRegistryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AsciiAnimationsRegistryService = TestBed.inject(AsciiAnimationsRegistryService);
    expect(service).toBeTruthy();
  });
});
