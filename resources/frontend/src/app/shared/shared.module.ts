import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MaterialModule } from '../material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { IfHasPermissionDirective } from './if-has-permission.directive';
import { MascaraFechaDirective } from './mascara-fecha.directive';
// import { FormularioContingenciaComponent } from './components/formulario-contingencia/formulario-contingencia.component';
// import { EditarFormularioContingenciaComponent } from './components/editar-formulario-contingencia/editar-formulario-contingencia.component';
// import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';

@NgModule({
    declarations: [IfHasPermissionDirective, MascaraFechaDirective],
    //FormularioContingenciaComponent, EditarFormularioContingenciaComponent, ConfirmDialogComponent
    imports: [
        CommonModule,
        FormsModule,
        FlexLayoutModule,
        MaterialModule,
        ReactiveFormsModule,
        HttpClientModule,
    ],
    exports: [
        CommonModule,
        FormsModule,
        FlexLayoutModule,
        MaterialModule,
        ReactiveFormsModule,
        HttpClientModule,
        IfHasPermissionDirective,
        MascaraFechaDirective
        // FormularioContingenciaComponent,
        // EditarFormularioContingenciaComponent    
    ]
})
export class SharedModule { }
