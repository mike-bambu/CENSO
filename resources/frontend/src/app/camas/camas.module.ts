import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { CamasRoutingModule } from './camas-routing.module';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getEspPaginatorIntl } from 'src/app/esp-paginator-intl';
import { ListComponentCamas } from './list-camas/list-camas.component';
import { FormComponentCamas } from './form-camas/form-camas.component';
import { DashCamasComponent } from './dash-camas/dash-camas.component';
//import { ConfirmActionDialogComponent } from '../../utils/confirm-action-dialog/confirm-action-dialog.component';


@NgModule({
    declarations: [DashCamasComponent, ListComponentCamas, FormComponentCamas],
    imports: [
        CommonModule,
        DecimalPipe,
        CamasRoutingModule,
        SharedModule
    ],
    providers: [
        { provide: MatPaginatorIntl, useValue: getEspPaginatorIntl() }
    ]
})
export class CamasModule { }
