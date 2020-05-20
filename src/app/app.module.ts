import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Components/login/login.component';
import { AuthApiService } from './Services/auth-api.service';
import { AuthGuard } from './auth.guard';
import { ProjetsComponent } from './Components/projets/projets.component';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { ListContactsComponent } from './Components/list-contacts/list-contacts.component';
import { ShowContactComponent } from './Components/show-contact/show-contact.component';
import { AddContactComponent } from './Components/add-contact/add-contact.component';
import { EditContactComponent } from './Components/edit-contact/edit-contact.component';
import {ReactiveFormsModule} from '@angular/forms';
import { TokenInterceptorService } from './Services/token-interceptor.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    ProjetsComponent,
    ListContactsComponent,
    ShowContactComponent,
    AddContactComponent,
    EditContactComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
  ],
  providers: [AuthApiService, AuthGuard,

  {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptorService,
    multi: true
  }],

  bootstrap: [AppComponent]
})
export class AppModule { }
