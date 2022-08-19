/************** MODULOS ******************/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';

/************** COMPONENTES ********************/
import { AdminComponent } from '../components/admin.component';
import { TabsComponent } from '../components/tabs/tabs.component';
import { ContainerComponent } from '../components/tables/container/container.component';
import { CategoriasComponent } from '../components/tables/categorias/categorias.component';
import { AdminsComponent } from '../components/tables/admins/admins.component';
import { EncuestasComponent } from '../components/tables/encuestas/encuestas.component';
import { AdminRoutingModule } from './admin-routing.module';

@NgModule({
  declarations: [
    AdminComponent,
    TabsComponent,
    ContainerComponent,
    CategoriasComponent,
    AdminsComponent,
    EncuestasComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    AdminRoutingModule
  ],
  exports: [AdminComponent],
  providers: [],
  bootstrap: [AdminComponent]
})
export class AdminModule { }
