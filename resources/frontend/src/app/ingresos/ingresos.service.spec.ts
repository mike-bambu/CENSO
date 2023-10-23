import { TestBed } from '@angular/core/testing';

import { PacientesService } from './pacientes.service';

describe('PermissionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PacientesService = TestBed.get(PacientesService);
    expect(service).toBeTruthy();
  });
});
