import { TestBed } from '@angular/core/testing';

import { ReporteAltasService } from './reporte-altas.service';

describe('MonitoreoClinicaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReporteAltasService = TestBed.get(ReporteAltasService);
    expect(service).toBeTruthy();
  });
});
