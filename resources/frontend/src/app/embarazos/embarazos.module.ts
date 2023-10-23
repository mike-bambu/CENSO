
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmbarazosRoutingModule } from './embarazos-routing.module';
//  import { MonitoreoModule } from './reporte-monitoreo/monitoreo.module'
// import { ReporteAltasModule } from './reporte-altas/reporte-altas.module'
import { PacientesEmbarazadasModule } from './pacientes-embarazadas/reporte-embarazos-hospitalizados/pacientes-embarazadas.module';
import { EmbarazosAmbulatoriosModule } from './pacientes-embarazadas/embarazos-ambulatorios/pacientes-embarazos-ambulatorios.module';

import { EmbarazosComponent } from './embarazos.component';

@NgModule({
  declarations: [EmbarazosComponent],
  imports: [
    CommonModule,
    EmbarazosRoutingModule
  ],
  exports: [
    // MonitoreoModule,
    // ReporteAltasModule,
    PacientesEmbarazadasModule,
    EmbarazosAmbulatoriosModule

  ]
})
export class EmbarazosModule { }

