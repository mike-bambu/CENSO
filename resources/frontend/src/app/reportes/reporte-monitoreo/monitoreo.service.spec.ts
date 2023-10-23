import { TestBed } from '@angular/core/testing';

import { MonitoreoClinicaService } from './monitoreo.service';

describe('MonitoreoClinicaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MonitoreoClinicaService = TestBed.get(MonitoreoClinicaService);
    expect(service).toBeTruthy();
  });
});
