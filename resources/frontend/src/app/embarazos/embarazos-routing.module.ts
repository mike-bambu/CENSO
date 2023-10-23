import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { EmbarazosComponent } from './embarazos.component';

const routes: Routes = [
  { path: 'embarazos', component: EmbarazosComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmbarazosRoutingModule { }
