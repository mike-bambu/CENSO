import { TestBed } from '@angular/core/testing';

import { AtencionPacientesService } from './atencion-pacientes.service';

describe('AtencionPacientesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AtencionPacientesService = TestBed.get(AtencionPacientesService);
    expect(service).toBeTruthy();
  });
});
