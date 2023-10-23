import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormComponentPacientes } from './form-pacientes.component';

describe('FormComponentPacientes', () => {
  let component: FormComponentPacientes;
  let fixture: ComponentFixture<FormComponentPacientes>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormComponentPacientes ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormComponentPacientes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
