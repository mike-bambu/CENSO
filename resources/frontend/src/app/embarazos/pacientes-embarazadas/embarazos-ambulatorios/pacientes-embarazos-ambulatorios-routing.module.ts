import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../auth/auth.guard';

import { EmbarazosAmbulatoriosComponent } from './embarazos-ambulatorios/embarazos-ambulatorios.component';



const routes: Routes = [
  { path: 'embarazos/embarazos-ambulatorios', component: EmbarazosAmbulatoriosComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PacientesEmbarazadasRoutingModule { }
