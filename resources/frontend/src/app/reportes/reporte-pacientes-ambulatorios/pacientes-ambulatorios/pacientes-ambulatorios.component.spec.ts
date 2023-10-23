import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PacientesAmbulatoriosComponent } from './pacientes-ambulatorios.component';

describe('PacientesAmbulatoriosComponent', () => {
  let component: PacientesAmbulatoriosComponent;
  let fixture: ComponentFixture<PacientesAmbulatoriosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PacientesAmbulatoriosComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PacientesAmbulatoriosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
