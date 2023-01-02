/************** MODULOS ******************/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './router/admin-routing.module';

/************** COMPONENTES ********************/
//ADMIN HOME
import { AdminComponent } from './components/controllers/admin.component';
import { HeaderComponent } from './components/controllers/header.component';
import { SpinnerComponent } from './components/controllers/spinner.component';
//DASHBOARD
import { DashboardComponent } from './components/controllers/dashboard.component';
import { ChartDialogComponent } from './components/controllers/chart-dialog.component';
//ADMINS USERS
import { AdminsComponent } from './components/controllers/admins.component';
import { AdminsTableComponent } from './components/controllers/admins-table.component';
import { AdminCreateComponent } from './components/controllers/admin-create.component';
import { AdminEditComponent } from './components/controllers/admin-edit.component';
import { AdminDeleteDialogComponent } from './components/controllers/admin-delete-dialog.component';
//COMPAÑIAS
import { CompaniasComponent } from './components/controllers/companias.component';
import { CompaniasTableComponent } from './components/controllers/companias-table.component';
import { CompaniaCreateComponent } from './components/controllers/compania-create.component';
import { CompaniaEditComponent } from './components/controllers/compania-edit.component';
import { CompaniaDeleteDialogComponent } from './components/controllers/compania-delete-dialog.component';
//TIPOS DE ENCUESTA
import { TiposEncuestaComponent } from './components/controllers/tipos-encuesta.component';
import { TiposEncuestaTableComponent } from './components/controllers/tipos-encuesta-table.component';
import { TiposEncuestaCreateComponent } from './components/controllers/tipos-encuesta-create.component';
import { TiposEncuestaEditComponent } from './components/controllers/tipos-encuesta-edit.component';
import { TiposEncuestaDeleteDialogComponent } from './components/controllers/tipos-encuesta-delete-dialog.component';
//ENCUESTA
import { EncuestaDeleteDialogComponent } from './components/controllers/encuesta-delete-dialog.component';
//LISTA DE CLIENTES
import { ListaClientesComponent } from './components/controllers/lista-clientes.component';

/*************** COMMONS **********************/
import { HTTP_INTERCEPTORS } from '@angular/common/http';

/*************** AUTH **********************/
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';

/*************** REDUCERS **********************/
import * as fromAdmins from './store/reducers/admin.reducers';
import * as fromCurrentUser from './store/reducers/currentuser.reducers';
import * as fromCompanias from './store/reducers/companias.reducers';
import * as fromTiposEncuesta from './store/reducers/tiposencuesta.reducers';
import * as fromEncuesta from './store/reducers/encuesta.reducers';
import * as fromResponse from './store/reducers/response.reducers';

/*************** EFFECTS ***********************/
import { AdminsEffect } from './store/effects/admin.effects';
import { CompaniasEffect } from './store/effects/companias.effects';
import { TiposEncuestaEffect } from './store/effects/tiposencuesta.effects';
import { CurrentUserEffect } from './store/effects/currentuser.effects';
import { EncuestaEffect } from './store/effects/encuesta.effects';

/**************** INTERCEPTORES ******************/
import { AdminInterceptor } from './services/admin.interceptor';
import { SpinnerInterceptor } from './services/spinner.interceptor';
import { ClientDataEffect } from './store/effects/response.effects';
import { FilterTipoEncuestaPipe } from './pipes/filter-tipo-encuesta.pipe';

@NgModule({
  declarations: [
    AdminComponent,
    TiposEncuestaTableComponent,
    AdminsComponent,
    CompaniasTableComponent,
    DashboardComponent,
    SpinnerComponent,
    AdminCreateComponent,
    AdminsTableComponent,
    ListaClientesComponent,
    HeaderComponent,
    AdminEditComponent,
    AdminDeleteDialogComponent,
    CompaniaDeleteDialogComponent,
    CompaniaCreateComponent,
    CompaniaEditComponent,
    CompaniasComponent,
    TiposEncuestaComponent,
    TiposEncuestaDeleteDialogComponent,
    TiposEncuestaCreateComponent,
    TiposEncuestaEditComponent,
    EncuestaDeleteDialogComponent,
    ChartDialogComponent,
    FilterTipoEncuestaPipe
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
    StoreModule.forFeature(fromEncuesta.encuestaFeatureKey, fromEncuesta.encuestaReducer),
    StoreModule.forFeature(fromResponse.responseFeatureKey, fromResponse.responseReducer),
    EffectsModule.forFeature([AdminsEffect, CompaniasEffect, TiposEncuestaEffect, CurrentUserEffect, EncuestaEffect, ClientDataEffect]),
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [AdminComponent, HeaderComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AdminInterceptor, multi: true },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService
  ],
  bootstrap: [AdminComponent]
})
export class AdminModule { }
