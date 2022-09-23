/************** MODULOS ******************/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/************** COMPONENTES ********************/
import { AdminComponent } from './components/controllers/admin.component';
import { TiposEncuestaComponent } from './components/controllers/tipos-encuesta.component';
import { AdminsComponent } from './components/controllers/admins.component';
import { EncuestasComponent } from './components/controllers/encuestas.component';
import { AdminRoutingModule } from './router/admin-routing.module';
import { CompaniasComponent } from './components/controllers/companias.component';
import { DashboardComponent } from './components/controllers/dashboard.component';
import { SpinnerComponent } from './components/controllers/spinner.component';
import { AdminCreateComponent } from './components/controllers/admin-create.component';
import { AdminsTableComponent } from './components/controllers/admins-table.component';
import { HeaderComponent } from './components/controllers/header.component';
import { ListaClientesComponent } from './components/controllers/lista-clientes.component';
import { AdminEditComponent } from './components/controllers/admin-edit.component';
import { DeleteDialogComponent } from './components/controllers/delete-dialog.component';

/*************** COMMONS **********************/
import { HTTP_INTERCEPTORS } from '@angular/common/http';

/*************** AUTH **********************/
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';

/*************** REDUCERS **********************/
import * as fromAdmins from './store/reducers/admin.reducers';
import * as fromCurrentUser from './store/reducers/currentuser.reducers';
import * as fromCompanias from './store/reducers/companias.reducers';
import * as fromTiposEncuesta from './store/reducers/tiposencuesta.reducers';

/*************** EFFECTS ***********************/
import { AdminsEffect } from './store/effects/admin.effects';
import { CompaniasEffect } from './store/effects/companias.effects';
import { TiposEncuestaEffect } from './store/effects/tiposencuesta.effects';
import { CurrentUserEffect } from './store/effects/currentuser.effects';

/**************** INTERCEPTORES ******************/
import { AdminInterceptor } from './services/admin.interceptor';
import { SpinnerInterceptor } from './services/spinner.interceptor';

@NgModule({
  declarations: [
    AdminComponent,
    TiposEncuestaComponent,
    AdminsComponent,
    EncuestasComponent,
    CompaniasComponent,
    DashboardComponent,
    SpinnerComponent,
    AdminCreateComponent,
    AdminsTableComponent,
    ListaClientesComponent,
    HeaderComponent,
    AdminEditComponent,
    DeleteDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    NgxChartsModule,
    AdminRoutingModule,
    StoreModule.forFeature(fromAdmins.adminFeatureKey, fromAdmins.adminReducer),
    StoreModule.forFeature(fromCurrentUser.currentUserFeatureKey, fromCurrentUser.currentUserReducer),
    StoreModule.forFeature(fromCompanias.companiasFeatureKey, fromCompanias.companiasReducer),
    StoreModule.forFeature(fromTiposEncuesta.tiposEncuestaFeatureKey, fromTiposEncuesta.tiposEncuestaReducer),
    EffectsModule.forFeature([AdminsEffect, CompaniasEffect, TiposEncuestaEffect, CurrentUserEffect]),
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [AdminComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AdminInterceptor, multi: true },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService
  ],
  bootstrap: [AdminComponent]
})
export class AdminModule { }
