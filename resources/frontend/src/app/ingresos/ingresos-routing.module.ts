import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/auth/auth.guard';

import { ListaComponentPacientes } from './lista/lista.component';
import { FormularioComponentPacientes } from './formulario/formulario.component';

const routes: Routes = [

  { path: 'ingresos',                  component: ListaComponentPacientes, canActivate: [AuthGuard] },
  //{ path: 'ingreso-pacientes/ingresar/:id',     component: FormComponent, canActivate: [AuthGuard] },
  { path: 'ingresos/nuevo',            component: FormularioComponentPacientes, canActivate: [AuthGuard] },
  { path: 'ingresos/editar/:id',       component: FormularioComponentPacientes, canActivate: [AuthGuard] },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IngresosRoutingModule { }
