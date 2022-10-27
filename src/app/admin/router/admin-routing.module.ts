import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from '../components/controllers/admin.component';
import { AdminsTableComponent } from '../components/controllers/admins-table.component';
import { AdminsComponent } from '../components/controllers/admins.component';
import { CompaniasTableComponent } from '../components/controllers/companias-table.component';
import { AdminCreateComponent } from '../components/controllers/admin-create.component';
import { DashboardComponent } from '../components/controllers/dashboard.component';
import { EncuestasComponent } from '../components/controllers/encuestas.component';
import { ListaClientesComponent } from '../components/controllers/lista-clientes.component';
import { TiposEncuestaComponent } from '../components/controllers/tipos-encuesta.component';
import { TiposEncuestaTableComponent } from '../components/controllers/tipos-encuesta-table.component';
import { AdminEditComponent } from '../components/controllers/admin-edit.component';
import { AdminGuard } from '../guards/admin.guard';
import { FsbsGuard } from '../guards/fsbs.guard';
import { UserGuard } from '../guards/user.guard';
import { CompaniaCreateComponent } from '../components/controllers/compania-create.component';
import { CompaniaEditComponent } from '../components/controllers/compania-edit.component';
import { CompaniasComponent } from '../components/controllers/companias.component';
import { TiposEncuestaCreateComponent } from '../components/controllers/tipos-encuesta-create.component';
import { TiposEncuestaEditComponent } from '../components/controllers/tipos-encuesta-edit.component';

const routes: Routes = [
    { path: 'admin', component: AdminComponent, children: [
        { path: 'dashboard', component: DashboardComponent },
        { path: 'admins', component: AdminsComponent, canActivateChild:[AdminGuard], children: [
          { path: 'view', component: AdminsTableComponent},
          { path: 'create', component: AdminCreateComponent},
          { path: 'edit/:codigo', component: AdminEditComponent },
          { path: '', redirectTo:'view', pathMatch:"full" },
        ]},
        { path: 'companias', component: CompaniasComponent, canActivateChild:[AdminGuard], canActivate: [FsbsGuard], children: [
          { path: 'view', component: CompaniasTableComponent},
          { path: 'create', component: CompaniaCreateComponent},
          { path: 'edit/:codigo/:compania', component: CompaniaEditComponent },
          { path: '', redirectTo:'view', pathMatch:"full" },
        ]},
        { path: 'tipos_encuesta', component: TiposEncuestaComponent, canActivateChild:[AdminGuard], children: [
          { path: 'view', component: TiposEncuestaTableComponent},
          { path: 'create', component: TiposEncuestaCreateComponent},
          { path: 'edit/:codigo/:identificador', component: TiposEncuestaEditComponent },
          { path: '', redirectTo:'view', pathMatch:"full" },
        ] },
        { path: 'encuestas', component: EncuestasComponent },
        { path: 'clientes', component: ListaClientesComponent },
        { path: '**', component: DashboardComponent },
      ],
      canActivate: [AdminGuard, UserGuard],
      canLoad: [AdminGuard, UserGuard]
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
