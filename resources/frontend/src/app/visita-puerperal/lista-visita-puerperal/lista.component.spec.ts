import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaComponentPacientes } from './lista.component';


describe('ListaUsuariosComponent', () => {
  let component: ListaComponentPacientes;
  let fixture: ComponentFixture<ListaComponentPacientes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaComponentPacientes ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaComponentPacientes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
