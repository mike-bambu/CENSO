import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { ServiciosRoutingModule } from './servicios-routing.module';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getEspPaginatorIntl } from 'src/app/esp-paginator-intl';
import { ListServiciosComponent } from './list/list.component';
import { FormServiciosComponent } from './form/form.component';
//import { ConfirmActionDialogComponent } from '../../utils/confirm-action-dialog/confirm-action-dialog.component';


@NgModule({
    declarations: [ListServiciosComponent, FormServiciosComponent],
    imports: [
        CommonModule,
        ServiciosRoutingModule,
        SharedModule
    ],
    providers: [
        { provide: MatPaginatorIntl, useValue: getEspPaginatorIntl() }
    ]
})
export class ServiciosModule { }
