import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { VisitaPuerperalRoutingModule } from './visita-puerperal-routing.module';
import { ListaComponentPacientes } from './lista-visita-puerperal/lista.component';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { getEspPaginatorIntl } from 'src/app/esp-paginator-intl';
// import { FormularioComponentPacientes } from './formulario/formulario.component';
import { DetailsComponentPacienteEgreso } from './details-alta/details-alta.component'
import { VisitaPuerperalDialogComponent } from './visita-domiciliar-dialog/visita-domiciliar-dialog.component'

//import { ConfirmActionDialogComponent } from '../../utils/confirm-action-dialog/confirm-action-dialog.component';


@NgModule({
    declarations: [
        ListaComponentPacientes,
        // FormularioComponentPacientes,
        DetailsComponentPacienteEgreso,
        VisitaPuerperalDialogComponent
    ],
    imports: [
        CommonModule,
        VisitaPuerperalRoutingModule,
        SharedModule,
        MatNativeDateModule,
        MatDatepickerModule,
        MatChipsModule
    ],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'es-MX' },
        { provide: MatPaginatorIntl, useValue: getEspPaginatorIntl() }
    ]
})
export class VisitaPuerperalModule { }
