import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsComponent } from '../components/controllers/tabs.component';
import { AdminGuard } from '../guards/admin.guard';

const routes: Routes = [
    {
      path: 'admin',
      children: [
        { path: '', redirectTo: "home", pathMatch: "full" },
        { path: 'home', component: TabsComponent }
      ],
      canActivate: [AdminGuard],
      canLoad: [AdminGuard]
    }
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})

export class AdminRoutingModule { }
