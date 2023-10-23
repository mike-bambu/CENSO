import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/auth/auth.guard';

import { ListComponentPacientes } from './list-pacientes/list-pacientes.component';
//import { FormComponentPacientes } from './form-pacientes/form-pacientes.component';

const routes: Routes = [

  { path: 'atencion-pacientes',                  component: ListComponentPacientes, canActivate: [AuthGuard] },
  //{ path: 'atencion-pacientes/ingresar/:id',     component: FormComponent, canActivate: [AuthGuard] },
  //{ path: 'atencion-pacientes/nuevo',            component: FormComponentPacientes, canActivate: [AuthGuard] },
  //{ path: 'atencion-pacientes/editar/:id',       component: FormComponentPacientes, canActivate: [AuthGuard] },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AtencionPacientesRoutingModule { }
