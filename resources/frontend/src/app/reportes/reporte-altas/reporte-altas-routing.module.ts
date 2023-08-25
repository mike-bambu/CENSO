import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReporteAltasComponent } from './altas/reporte-altas.component';
import { AuthGuard } from '../../auth/auth.guard';


const routes: Routes = [
  { path: 'concentrados/reporte-altas', component: ReporteAltasComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReporteAltasRoutingModule { }
