import { TestBed } from '@angular/core/testing';

import { AngleCalculationService } from './angle-calculation.service';

describe('AngleCalculationService', () => {
  let service: AngleCalculationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AngleCalculationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
