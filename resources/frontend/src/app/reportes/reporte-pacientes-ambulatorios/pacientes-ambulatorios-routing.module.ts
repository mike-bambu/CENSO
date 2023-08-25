import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../auth/auth.guard';

import { PacientesAmbulatoriosComponent } from './pacientes-ambulatorios/pacientes-ambulatorios.component';



const routes: Routes = [
  { path: 'reportes/pacientes-ambulatorios', component: PacientesAmbulatoriosComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PacientesAmbulatoriosRoutingModule { }
