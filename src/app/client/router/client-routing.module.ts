import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from 'src/app/admin/guards/admin.guard';
import { HomeComponent } from '../components/controllers/home.component';
import { PreguntasComponent } from '../components/controllers/preguntas.component';
import { SelecEncuestaComponent } from '../components/controllers/selec-encuesta.component';

const routes: Routes = [
  { path: 'user', component: HomeComponent, children: [
    { path: 'encuesta/:tipo_encuesta', component: PreguntasComponent },
    { path: '**', component: SelecEncuestaComponent },
  ],
  canActivate: [AdminGuard],
  canLoad: [AdminGuard]
}
]

@NgModule({
declarations: [],
imports: [
  RouterModule.forChild(routes)
],
exports: [RouterModule]
})

export class ClientRoutingModule { }
