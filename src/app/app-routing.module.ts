
import { NgModule } from '@angular/core';
import { ListContactsComponent } from './Components/contact/list-contacts/list-contacts.component';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { AuthGuard } from './auth.guard';
import { ListGammesComponent } from './Components/gamme/list-gammes/list-gammes.component';
import { ListPanelsComponent } from './Components/panel/list-panels/list-panels.component';
import { RoleGuard } from './role.guard';
import { ListCompenentComponent } from './Components/component/list-compenent/list-compenent.component';
import { ListProjectComponent } from './Components/project/list-project/list-project.component';
import {ListProductComponent} from './Components/product/list-product/list-product.component';
import { AddNeedComponent } from './Components/project/need/add-need/add-need.component';
import { ProjectsFilterComponent } from './Components/projects-filter/projects-filter.component';
import { AreaComponent } from './Components/area/area.component';
import { ConfiguratorComponent } from './Components/configurator/configurator.component';
import { SummaryComponent } from './Components/summary/summary.component';
import { ComposantComponent } from './Components/devis/composant/composant.component';
import { ProjetComponent } from './Components/devis/projet/projet.component';
import { ProjetsComponent } from './Components/projets/projets.component';


const routes: Routes = [

{ path: 'projets', component: ListProjectComponent, canActivate: [AuthGuard] },
  {path: "",redirectTo: "/projets",pathMatch: "full"},
  {path: "projets",component: ProjetsComponent,canActivate: [AuthGuard]},
  {path: "login",component: LoginComponent},
  {path: "contacts",component:ListContactsComponent, canActivate: [AuthGuard]},
  {path: "panels",component:ListPanelsComponent,canActivate: [AuthGuard, RoleGuard]},
  {path: "component",component: ListCompenentComponent, canActivate: [AuthGuard, RoleGuard]},
  {path: "gammes",component:ListGammesComponent, canActivate: [AuthGuard, RoleGuard]},
  {path: 'add-need', component: AddNeedComponent, canActivate: [AuthGuard]},
  {path: 'projectSearch', component: ProjectsFilterComponent, canActivate: [AuthGuard]},
  {path: 'products', component: ListProductComponent, canActivate: [AuthGuard, RoleGuard]},
  {path: 'composant', component: ComposantComponent},
  { path: "create/project",
  children: [
    {path: "info",component:ProjetComponent},
    {path: "areas",component:AreaComponent},
    {path: "needs",component:AddNeedComponent},
    {path: "configurators",component:ConfiguratorComponent},
    {path: "components",component:ComposantComponent},
    {path: "summary", component: SummaryComponent},
  ]
},
  {path:"projet",component:ProjetComponent, canActivate: [AuthGuard]},


];

@NgModule({

    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  
})
export class AppRoutingModule {
}
