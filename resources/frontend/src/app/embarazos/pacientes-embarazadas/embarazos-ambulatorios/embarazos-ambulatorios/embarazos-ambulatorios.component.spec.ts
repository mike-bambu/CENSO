import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbarazosAmbulatoriosComponent } from './embarazos-ambulatorios.component';

describe('EmbarazosAmbulatoriosComponent', () => {
  let component: EmbarazosAmbulatoriosComponent;
  let fixture: ComponentFixture<EmbarazosAmbulatoriosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EmbarazosAmbulatoriosComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmbarazosAmbulatoriosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
