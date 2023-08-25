import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarAltaDialogComponent } from './agregar-alta-dialog.component';

describe('AgregarAltaDialogComponent', () => {
  let component: AgregarAltaDialogComponent;
  let fixture: ComponentFixture<AgregarAltaDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarAltaDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarAltaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
