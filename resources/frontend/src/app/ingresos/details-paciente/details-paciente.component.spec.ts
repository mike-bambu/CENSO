import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsComponentPaciente } from './details-paciente.component';

describe('DetailsComponentPaciente', () => {
  let component: DetailsComponentPaciente;
  let fixture: ComponentFixture<DetailsComponentPaciente>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsComponentPaciente ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsComponentPaciente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
