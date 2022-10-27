import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../components/controllers/home.component';

const routes: Routes = [
  { path: 'user', component: HomeComponent }
]

@NgModule({
declarations: [],
imports: [
  RouterModule.forChild(routes)
],
exports: [RouterModule]
})

export class ClientRoutingModule { }
