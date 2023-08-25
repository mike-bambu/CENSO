import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { IngresosRoutingModule } from './ingresos-routing.module';
import { ListaComponentPacientes } from './lista/lista.component';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { getEspPaginatorIntl } from 'src/app/esp-paginator-intl';
import { FormularioComponentPacientes } from './formulario/formulario.component';
import { DetailsComponentPaciente } from './details-paciente/details-paciente.component';
import { AtencionDialogComponent } from './atencion-dialog/atencion-dialog.component';
// import { SeguimientoDialogComponent } from './seguimiento-dialog/seguimiento-dialog.component';
import { AltaDialogComponent } from './alta-dialog/alta-dialog.component';

import { ConfirmActionDialogComponent } from './confirm-action-dialog/confirm-action-dialog.component';

//import { ConfirmActionDialogComponent } from '../../utils/confirm-action-dialog/confirm-action-dialog.component';


@NgModule({
    declarations: [
        ListaComponentPacientes,
        FormularioComponentPacientes,
        DetailsComponentPaciente,
        AtencionDialogComponent,
        AltaDialogComponent,
        ConfirmActionDialogComponent
    ],
    imports: [
        CommonModule,
        IngresosRoutingModule,
        SharedModule,
        MatNativeDateModule,
        MatDatepickerModule,
    ],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'es-MX' },
        { provide: MatPaginatorIntl, useValue: getEspPaginatorIntl() }
    ]
})
export class IngresosModule { }
