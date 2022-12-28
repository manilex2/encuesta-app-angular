/************** MODULOS ******************/
import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from '../material.module';
import { HttpClientModule } from '@angular/common/http';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { ClientModule } from './client/client.module'
import { ActionReducer, INIT, MetaReducer, StoreModule } from '@ngrx/store';
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

/***************** REDUCERS ********************/
import { appReducer } from './shared/store/reducers/app.reducers';

/***************** ENVIRONMENTS ********************/
import { environment } from '../environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';

registerLocaleData(myLocaleES);

@NgModule({
  declarations: [
    AppComponent,
    NavComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      preventDuplicates: true,
      maxOpened: 1
    }),
    AppRoutingModule,
    MaterialModule,
    AdminModule,
    AuthModule,
    ClientModule,
    HttpClientModule,
    StoreModule.forRoot({ appState: appReducer }),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
