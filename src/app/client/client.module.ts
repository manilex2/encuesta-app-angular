/************** MODULOS ******************/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientRoutingModule } from './router/client-routing.module';
import { AdminModule } from "../admin/admin.module";
import { OnlineStatusModule } from 'ngx-online-status';

/*************** INTERCEPTORS **********************/
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SpinnerInterceptor } from '../admin/services/spinner.interceptor';

/*************** AUTH **********************/
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';

/************** COMPONENTES ********************/
import { HomeComponent } from './components/controllers/home.component';
import { PreguntasComponent } from './components/controllers/preguntas.component';
import { SelecEncuestaComponent } from './components/controllers/selec-encuesta.component';

@NgModule({
    declarations: [
        HomeComponent,
        PreguntasComponent,
        SelecEncuestaComponent
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true },
        { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
        JwtHelperService
    ],
    imports: [
        CommonModule,
        ClientRoutingModule,
        MaterialModule,
        AdminModule,
        ReactiveFormsModule,
        FormsModule,
        OnlineStatusModule
    ]
})
export class ClientModule { }
