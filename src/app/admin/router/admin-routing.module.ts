import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from '../components/controllers/admin.component';
import { AdminsTableComponent } from '../components/controllers/admins-table.component';
import { AdminsComponent } from '../components/controllers/admins.component';
import { CompaniasComponent } from '../components/controllers/companias.component';
import { CreateAdminComponent } from '../components/controllers/admin-create.component';
import { DashboardComponent } from '../components/controllers/dashboard.component';
import { EncuestasComponent } from '../components/controllers/encuestas.component';
import { ListaClientesComponent } from '../components/controllers/lista-clientes.component';
import { TiposEncuestaComponent } from '../components/controllers/tipos-encuesta.component';
import { EditAdminComponent } from '../components/controllers/edit-admin.component';
import { AdminGuard } from '../guards/admin.guard';
import { FsbsGuard } from '../guards/fsbs.guard';

const routes: Routes = [
    { path: 'admin', component: AdminComponent, children: [
        { path: 'dashboard', component: DashboardComponent },
        { path: 'admins', component: AdminsComponent, canActivate: [FsbsGuard], children: [
          { path: 'view', component: AdminsTableComponent},
          { path: 'create', component: CreateAdminComponent},
          { path: 'edit/:id', component: EditAdminComponent },
          { path: '', redirectTo:'view', pathMatch:"full" },
        ]},
        { path: 'companias', component: CompaniasComponent },
        { path: 'tipos_encuesta', component: TiposEncuestaComponent },
        { path: 'encuestas', component: EncuestasComponent },
        { path: 'clientes', component: ListaClientesComponent },
        { path: '**', component: DashboardComponent },
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

export class AdminRoutingModule { }
