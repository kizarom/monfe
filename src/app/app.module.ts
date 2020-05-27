import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Components/login/login.component';
import { AuthApiService } from './Services/auth-api.service';
import { AuthGuard } from './auth.guard';
import { ProjetsComponent } from './Components/projets/projets.component';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { ListContactsComponent } from './Components/contact/list-contacts/list-contacts.component';
import { ShowContactComponent } from './Components/contact/show-contact/show-contact.component';
import { AddContactComponent } from './Components/contact/add-contact/add-contact.component';
import { EditContactComponent } from './Components/contact/edit-contact/edit-contact.component';
import {ReactiveFormsModule} from '@angular/forms';
import {TokenInterceptorService} from './Services/token-interceptor.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ListProductComponent} from './Components/product/list-product/list-product.component';
import {ShowProductComponent} from './Components/product/show-product/show-product.component';
import {EditProductComponent} from './Components/product/edit-product/edit-product.component';
import {AddProductComponent} from './Components/product/add-product/add-product.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { AddGammeComponent } from './Components/gamme/add-gamme/add-gamme.component';
import { EditGammeComponent } from './Components/gamme/edit-gamme/edit-gamme.component';
import { ListGammesComponent } from './Components/gamme/list-gammes/list-gammes.component';
import { ShowGammeComponent } from './Components/gamme/show-gamme/show-gamme.component';
import { ListPanelsComponent } from './Components/panel/list-panels/list-panels.component';
import { AddPanelComponent } from './Components/panel/add-panel/add-panel.component';
import { EditPanelComponent } from './Components/panel/edit-panel/edit-panel.component';
import { ShowPanelComponent } from './Components/panel/show-panel/show-panel.component';
import { ListCompenentComponent } from './Components/component/list-compenent/list-compenent.component';
import { ShowCompenentComponent } from './Components/component/show-compenent/show-compenent.component';
import { AddCompenentComponent } from './Components/component/add-compenent/add-compenent.component';
import { EditCompenentComponent } from './Components/component/edit-compenent/edit-compenent.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {DataTablesModule} from 'angular-datatables';

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
    ListProductComponent,
    ShowProductComponent,
    EditProductComponent,
    AddProductComponent,
    AddGammeComponent,
    EditGammeComponent,
    ListGammesComponent,
    ShowGammeComponent,
    ListPanelsComponent,
    AddPanelComponent,
    EditPanelComponent,
    ShowPanelComponent,
    ListCompenentComponent,
    ShowCompenentComponent,
    AddCompenentComponent,
    EditCompenentComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgxPaginationModule, 
   NgxSpinnerModule,
    BrowserAnimationsModule,
    DataTablesModule,
  ],
  providers: [AuthApiService, AuthGuard,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptorService,
    multi: true
  }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule {
}
