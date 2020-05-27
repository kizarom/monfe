import { TestBed } from '@angular/core/testing';

import { ComponentApiService } from './component-api.service';

describe('ComponentApiService', () => {
  let service: ComponentApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComponentApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
