import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListComponentPacientes } from './list-pacientes.component';

describe('ListComponent', () => {
  let component: ListComponentPacientes;
  let fixture: ComponentFixture<ListComponentPacientes>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListComponentPacientes ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListComponentPacientes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
