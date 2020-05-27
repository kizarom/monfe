import { TestBed } from '@angular/core/testing';

import { GammeApiService } from './gamme-api.service';

describe('GammeApiService', () => {
  let service: GammeApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GammeApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
