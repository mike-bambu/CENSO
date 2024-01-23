import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { CalidadComponent } from './calidad.component';
import { ListaComponentPartos } from './partos/lista-partos/lista-partos.component';
import { QuestionsComponent } from './questions/questions.component';

const routes: Routes = [
  { path: 'calidad', component: CalidadComponent, canActivate: [AuthGuard] },
  { path: 'calidad/vista-partos', component: ListaComponentPartos, canActivate: [AuthGuard] },
  { path: 'calidad/questions', component: QuestionsComponent, canActivate: [AuthGuard] },
  { path: 'calidad/questions/:id',       component: QuestionsComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalidadRoutingModule { }
