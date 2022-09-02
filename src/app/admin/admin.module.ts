/************** MODULOS ******************/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { NgxChartsModule } from '@swimlane/ngx-charts';

/************** COMPONENTES ********************/
import { AdminComponent } from './components/controllers/admin.component';
import { TiposEncuestaComponent } from './components/controllers/tipos-encuesta.component';
import { AdminsComponent } from './components/controllers/admins.component';
import { EncuestasComponent } from './components/controllers/encuestas.component';
import { AdminRoutingModule } from './router/admin-routing.module';
import { CompaniasComponent } from './components/controllers/companias.component';
import { DashboardComponent } from './components/controllers/dashboard.component';
import { SpinnerComponent } from './components/controllers/spinner.component';
import { CreateAdminComponent } from './components/controllers/create-admin.component';
import { AdminsTableComponent } from './components/controllers/admins-table.component';

/*************** COMMONS **********************/
import { HTTP_INTERCEPTORS } from '@angular/common/http';

/*************** AUTH **********************/
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';

/*************** REDUCERS **********************/
import { adminReducer } from "./store/reducers/admin.reducer";
import { companiaReducer } from "./store/reducers/compania.reducer";

/*************** EFFECTS ***********************/
import { AdminsEffect } from './store/effects/admin.effect';
import { CompaniasEffect } from './store/effects/compania.effect';

/**************** INTERCEPTORES ******************/
import { AdminInterceptor } from './services/admin.interceptor';
import { SpinnerInterceptor } from './services/spinner.interceptor';
import { ReactiveFormsModule } from '@angular/forms';
import { ListaClientesComponent } from './components/controllers/lista-clientes.component';

@NgModule({
  declarations: [
    AdminComponent,
    TiposEncuestaComponent,
    AdminsComponent,
    EncuestasComponent,
    CompaniasComponent,
    DashboardComponent,
    SpinnerComponent,
    CreateAdminComponent,
    AdminsTableComponent,
    ListaClientesComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    NgxChartsModule,
    AdminRoutingModule,
    StoreModule.forFeature('admins', adminReducer),
    StoreModule.forFeature('companias', companiaReducer),
    EffectsModule.forFeature([AdminsEffect, CompaniasEffect]),
    ReactiveFormsModule
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
