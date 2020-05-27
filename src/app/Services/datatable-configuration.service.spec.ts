import { TestBed } from '@angular/core/testing';

import { DatatableConfigurationService } from './datatable-configuration.service';

describe('DatatableConfigurationService', () => {
  let service: DatatableConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatatableConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
