import { TestBed } from '@angular/core/testing';

import { CamasService } from './camas.service';

describe('ServiciosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CamasService = TestBed.get(CamasService);
    expect(service).toBeTruthy();
  });
});
