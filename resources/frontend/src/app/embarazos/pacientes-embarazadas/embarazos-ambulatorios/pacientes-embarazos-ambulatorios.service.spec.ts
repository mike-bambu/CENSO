import { TestBed } from '@angular/core/testing';

import { PacientesAmbulatoriosService } from './pacientes-ambulatorios.service';

describe('PacientesAmbulatoriosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PacientesAmbulatoriosService = TestBed.get(PacientesAmbulatoriosService);
    expect(service).toBeTruthy();
  });
});
