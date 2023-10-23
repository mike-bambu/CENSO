
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportesRoutingModule } from './reportes-routing.module';
import { MonitoreoModule } from './reporte-monitoreo/monitoreo.module'
import { ReporteAltasModule } from './reporte-altas/reporte-altas.module'
import { PacientesAmbulatoriosModule } from './reporte-pacientes-ambulatorios/pacientes-ambulatorios.module'

import { ReportesComponent } from './reportes.component';

@NgModule({
  declarations: [ReportesComponent],
  imports: [
    CommonModule,
    ReportesRoutingModule
  ],
  exports: [
    MonitoreoModule,
    ReporteAltasModule,
    PacientesAmbulatoriosModule

  ]
})
export class ReportesModule { }

