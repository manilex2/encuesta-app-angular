/************** MODULOS ******************/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtHelperService, JWT_OPTIONS  } from '@auth0/angular-jwt';
import { AuthRoutingModule } from './router/auth-routing.module';

/************** COMPONENTES ********************/
import { LoginComponent } from './components/controllers/login.component';
import { AuthComponent } from './components/controllers/auth.component';

/**************** INTERCEPTOR ******************/
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
