import { TestBed } from '@angular/core/testing';

import { LawService } from './law.service';

describe('LawService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LawService = TestBed.get(LawService);
    expect(service).toBeTruthy();
  });
});
