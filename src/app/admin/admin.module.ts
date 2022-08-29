/************** MODULOS ******************/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { NgxChartsModule } from '@swimlane/ngx-charts';

/************** COMPONENTES ********************/
import { AdminComponent } from './components/controllers/admin.component';
import { TabsComponent } from './components/controllers/tabs.component';
import { ContainerComponent } from './components/controllers/container.component';
import { CategoriasComponent } from './components/controllers/categorias.component';
import { AdminsComponent } from './components/controllers/admins.component';
import { EncuestasComponent } from './components/controllers/encuestas.component';
import { AdminRoutingModule } from './router/admin-routing.module';
import { CompaniasComponent } from './components/controllers/companias.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';

/*************** REDUCERS **********************/
import { adminReducer } from "./store/reducers/admin.reducer";
import { companiaReducer } from "./store/reducers/compania.reducer";

/*************** EFFECTS ***********************/
import { AdminsEffect } from './store/effects/admin.effect';
import { CompaniasEffect } from './store/effects/compania.effect';

/**************** INTERCEPTOR ******************/
import { AdminInterceptor } from './services/admin.interceptor';
import { DashboardComponent } from './components/controllers/dashboard.component';

@NgModule({
  declarations: [
    AdminComponent,
    TabsComponent,
    ContainerComponent,
    CategoriasComponent,
    AdminsComponent,
    EncuestasComponent,
    CompaniasComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    NgxChartsModule,
    AdminRoutingModule,
    StoreModule.forFeature('admins', adminReducer),
    StoreModule.forFeature('companias', companiaReducer),
    EffectsModule.forFeature([AdminsEffect, CompaniasEffect])
  ],
  exports: [AdminComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AdminInterceptor, multi: true },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService
  ],
  bootstrap: [AdminComponent]
})
export class AdminModule { }
