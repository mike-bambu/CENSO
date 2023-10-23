import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../auth/auth.guard';

import { PacientesEmbarazadasComponent } from './embarazadas/pacientes-embarazadas.component';



const routes: Routes = [
  { path: 'embarazos/embarazos-hospitalizados', component: PacientesEmbarazadasComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PacientesEmbarazadasRoutingModule { }
