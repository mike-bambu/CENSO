import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteAltasComponent } from './reporte-altas.component';

describe('MonitoreoComponent', () => {
  let component: ReporteAltasComponent;
  let fixture: ComponentFixture<ReporteAltasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReporteAltasComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteAltasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
