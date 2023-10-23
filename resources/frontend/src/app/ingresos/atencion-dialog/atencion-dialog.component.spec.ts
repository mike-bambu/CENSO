import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarAtencionDialogComponent } from './agregar-atencion-dialog.component';

describe('AgregarAtencionDialogComponent', () => {
  let component: AgregarAtencionDialogComponent;
  let fixture: ComponentFixture<AgregarAtencionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarAtencionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarAtencionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
