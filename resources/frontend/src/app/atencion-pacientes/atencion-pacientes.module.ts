import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { AtencionPacientesRoutingModule } from './atencion-pacientes-routing.module';
import { ListComponentPacientes } from './list-pacientes/list-pacientes.component';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { getEspPaginatorIntl } from 'src/app/esp-paginator-intl';
//import { FormComponentPacientes } from './form-pacientes/form-pacientes.component';
import { DetailsComponentPaciente } from './details-paciente/details-paciente.component'
import { AgregarSeguimientoDialogComponent } from './agregar-seguimiento-dialog/agregar-seguimiento-dialog.component';
import { AgregarAltaDialogComponent } from './agregar-alta-dialog/agregar-alta-dialog.component';

//import { ConfirmActionDialogComponent } from '../../utils/confirm-action-dialog/confirm-action-dialog.component';


@NgModule({
    declarations: [
        ListComponentPacientes,
        //FormComponentPacientes,
        DetailsComponentPaciente,
        AgregarSeguimientoDialogComponent,
        AgregarAltaDialogComponent
    ],
    imports: [
        CommonModule,
        AtencionPacientesRoutingModule,
        SharedModule,
        MatNativeDateModule,
        MatDatepickerModule
    ],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'es-MX' },
        { provide: MatPaginatorIntl, useValue: getEspPaginatorIntl() }
    ]
})
export class AtencionPacientesModule { }
