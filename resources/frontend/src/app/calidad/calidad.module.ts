import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalidadRoutingModule } from './calidad-routing.module';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getEspPaginatorIntl } from '../esp-paginator-intl';
import { CalidadComponent } from './calidad.component';
import { SharedModule } from '../shared/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ListaComponentPartos } from './partos/lista-partos/lista-partos.component';
import { DetailsDialogComponent } from './details-dialog/details-dialog.component';
import { QuestionsComponent } from './questions/questions.component';
import { ChangeBgDirective } from './change-bg.directive';
import { PartosQuestionsComponent } from './partos-questions/partos-questions.component';

@NgModule({
  declarations: [
    ListaComponentPartos,
    CalidadComponent,
    DetailsDialogComponent,
    QuestionsComponent,
    ChangeBgDirective,
    PartosQuestionsComponent
    
  ],
  
  imports: [
    CommonModule,
    CalidadRoutingModule,
    SharedModule,
    MatNativeDateModule,
    MatDatepickerModule,
],
providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX' },
    { provide: MatPaginatorIntl, useValue: getEspPaginatorIntl() }
]
})
export class CalidadModule { }
