import { TestBed } from '@angular/core/testing';

import { PanelApiService } from './panel-api.service';

describe('PanelApiService', () => {
  let service: PanelApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PanelApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
