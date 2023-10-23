import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { getEspPaginatorIntl } from 'src/app/esp-paginator-intl';
import { PacientesAmbulatoriosRoutingModule } from './pacientes-ambulatorios-routing.module';
import { PacientesAmbulatoriosComponent } from './pacientes-ambulatorios/pacientes-ambulatorios.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [PacientesAmbulatoriosComponent],
  imports: [
    CommonModule,
    MatNativeDateModule,
    MatDatepickerModule,
    PacientesAmbulatoriosRoutingModule,
    SharedModule
  ],
  providers:[
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX'},
    { provide: MatPaginatorIntl, useValue: getEspPaginatorIntl() }
    
  ]
})
export class PacientesAmbulatoriosModule { }
