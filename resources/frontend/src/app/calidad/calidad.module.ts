import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalidadRoutingModule } from './calidad-routing.module';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getEspPaginatorIntl } from '../esp-paginator-intl';
import { CalidadComponent } from './calidad.component';

@NgModule({
  declarations: [
    CalidadComponent
  ],
  imports: [
    CommonModule,
    CalidadRoutingModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX' },
    { provide: MatPaginatorIntl, useValue: getEspPaginatorIntl() }
]
})
export class CalidadModule { }
