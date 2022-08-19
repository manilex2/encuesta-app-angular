/************** MODULOS ******************/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';

/************** COMPONENTES ********************/
import { NavComponent } from '../components/nav/nav.component';
import { HomeComponent } from '../components/home.component';

@NgModule({
  declarations: [
    HomeComponent,
    NavComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [HomeComponent],
  providers: [],
  bootstrap: [HomeComponent]
})
export class HomeModule { }
