import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { LawService } from './law.service';

describe('LawService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
  }));

  it('should be created', () => {
    const service: LawService = TestBed.get(LawService);
    expect(service).toBeTruthy();
  });
});
