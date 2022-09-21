/************** MODULOS ******************/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtHelperService, JWT_OPTIONS  } from '@auth0/angular-jwt';
import { AuthRoutingModule } from './router/auth-routing.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

/************** COMPONENTES ********************/
import { LoginComponent } from './components/controllers/login.component';
import { AuthComponent } from './components/controllers/auth.component';

/*************** REDUCERS **********************/
import * as fromLogin from './store/reducers/login.reducers';

/*************** EFFECTS ***********************/
import { LoginEffect } from './store/effects/login.effects';

/**************** INTERCEPTORES ******************/
import { AuthInterceptor } from './services/auth.interceptor';

@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    AuthRoutingModule,
    /* StoreModule.forFeature(fromLogin.loginFeatureKey, fromLogin.loginReducer),
    EffectsModule.forFeature([LoginEffect]) */
  ],
  exports: [AuthComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService
  ],
  bootstrap: [AuthComponent]
})
export class AuthModule { }
