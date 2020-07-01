import { TestBed } from '@angular/core/testing';

import { DatableConfAlternativeService } from './datable-conf-alternative.service';

describe('DatableConfAlternativeService', () => {
  let service: DatableConfAlternativeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatableConfAlternativeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
