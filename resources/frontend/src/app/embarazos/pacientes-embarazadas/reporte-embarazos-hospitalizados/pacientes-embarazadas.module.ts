import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { getEspPaginatorIntl } from 'src/app/esp-paginator-intl';
import { PacientesEmbarazadasRoutingModule } from './pacientes-embarazadas-routing.module';
import { PacientesEmbarazadasComponent } from './embarazadas/pacientes-embarazadas.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [PacientesEmbarazadasComponent],
  imports: [
    CommonModule,
    MatNativeDateModule,
    MatDatepickerModule,
    PacientesEmbarazadasRoutingModule,
    SharedModule
  ],
  providers:[
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX'},
    { provide: MatPaginatorIntl, useValue: getEspPaginatorIntl() }
    
  ]
})
export class PacientesEmbarazadasModule { }
