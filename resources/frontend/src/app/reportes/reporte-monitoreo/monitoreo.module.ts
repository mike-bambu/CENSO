import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { getEspPaginatorIntl } from 'src/app/esp-paginator-intl';
import { MonitoreoRoutingModule } from './monitoreo-routing.module';
import { MonitoreoComponent } from './monitoreo/monitoreo.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [MonitoreoComponent],
  imports: [
    CommonModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MonitoreoRoutingModule,
    SharedModule
  ],
  providers:[
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX'},
    { provide: MatPaginatorIntl, useValue: getEspPaginatorIntl() }
    
  ]
})
export class MonitoreoModule { }
