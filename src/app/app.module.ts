/************** MODULOS ******************/
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from '../material.module';
import { HttpClientModule } from '@angular/common/http';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { StoreModule } from '@ngrx/store';
import { ToastrModule } from 'ngx-toastr';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

/************** COMPONENTES ********************/
import { AppComponent } from './app.component';
import { NavComponent } from './home/components/controllers/nav.component';

/**************** COMMONS **********************/
import myLocaleES from '@angular/common/locales/es-EC';
import { registerLocaleData } from "@angular/common";

/***************** EFFECTS ********************/
import { EffectsModule } from '@ngrx/effects';

/***************** ENVIRONMENTS ********************/
import { environment } from '../environments/environment';

registerLocaleData(myLocaleES);

@NgModule({
  declarations: [
    AppComponent,
    NavComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    AppRoutingModule,
    MaterialModule,
    AdminModule,
    AuthModule,
    HttpClientModule,
    StoreModule.forRoot({}, {}),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
