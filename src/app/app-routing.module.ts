
import { NgModule } from '@angular/core';
import { ListContactsComponent } from './Components/contact/list-contacts/list-contacts.component';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { AuthGuard } from './auth.guard';
import { ProjetsComponent } from './Components/projets/projets.component';
import { ListGammesComponent } from './Components/gamme/list-gammes/list-gammes.component';
import { ListPanelsComponent } from './Components/panel/list-panels/list-panels.component';
import { RoleGuard } from './role.guard';
import { ListCompenentComponent } from './Components/component/list-compenent/list-compenent.component';
import {ListProductComponent} from './Components/product/list-product/list-product.component';


const routes: Routes = [

  {path: "",redirectTo: "/projets",pathMatch: "full"},
  {path: "projets",component: ProjetsComponent,canActivate: [AuthGuard]},
  {path: "login",component: LoginComponent},
  {path: "contacts",component:ListContactsComponent, canActivate: [AuthGuard]},
  {path: "panels",component:ListPanelsComponent,canActivate: [AuthGuard, RoleGuard]},
  {path: "component",component: ListCompenentComponent, canActivate: [AuthGuard, RoleGuard]},
  {path: "gammes",component:ListGammesComponent, canActivate: [AuthGuard, RoleGuard]},
  {path: 'products', component: ListProductComponent, canActivate: [AuthGuard]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
