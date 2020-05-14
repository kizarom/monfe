import { NgModule } from '@angular/core';
import { ShowContactComponent } from './Components/show-contact/show-contact.component';
import { ListContactsComponent } from './Components/list-contacts/list-contacts.component';
import { AddContactComponent } from './Components/add-contact/add-contact.component';
import { EditContactComponent } from './Components/edit-contact/edit-contact.component';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { AuthGuard } from './auth.guard';
import { ProjetsComponent } from './Components/projets/projets.component';

const routes: Routes = [

   {path: '',redirectTo: '/projets',pathMatch: 'full'},
  {path: 'projets',component: ProjetsComponent,canActivate: [AuthGuard]},
  {path: 'login',component: LoginComponent},



  {path:"contacts",component:ListContactsComponent, canActivate: [AuthGuard]},
  {path:"contacts/show/:id",component:ShowContactComponent,canActivate: [AuthGuard]},
  {path:"contacts/add",component:AddContactComponent,canActivate: [AuthGuard]},
  {path:"contacts/edit/:id",component:EditContactComponent,canActivate: [AuthGuard]},

  

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
