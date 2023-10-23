import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/auth/auth.guard';

import { ListComponentCamas } from './list-camas/list-camas.component';

import { DashCamasComponent } from './dash-camas/dash-camas.component';

const routes: Routes = [
  { path: 'resumen-camas', component: DashCamasComponent, canActivate: [AuthGuard] },
  { path: 'camas', component: ListComponentCamas, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CamasRoutingModule { }
