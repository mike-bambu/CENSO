import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarSeguimientoDialogComponent } from './agregar-seguimiento-dialog.component';

describe('AgregarSeguimientoDialogComponent', () => {
  let component: AgregarSeguimientoDialogComponent;
  let fixture: ComponentFixture<AgregarSeguimientoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarSeguimientoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarSeguimientoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
