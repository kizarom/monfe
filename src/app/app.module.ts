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
import {NgbModule, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
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
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ListProjectComponent } from './Components/project/list-project/list-project.component';
import { EditProjectComponent } from './Components/project/edit-project/edit-project.component';
import { ShowProjectComponent } from './Components/project/show-project/show-project.component';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { AddProjectComponent } from './Components/project/add-project/add-project.component';
import {DataTablesModule} from 'angular-datatables';
import { AddNeedComponent } from './Components/project/need/add-need/add-need.component';
import { ProjectsFilterComponent } from './Components/projects-filter/projects-filter.component';
import { AreaComponent } from './Components/area/area.component';
import { ResizableModule } from 'angular-resizable-element';
import { ConfiguratorComponent } from './Components/configurator/configurator.component';
import { SummaryComponent } from './Components/summary/summary.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ProjetComponent } from './Components/devis/projet/projet.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ComposantComponent } from './Components/devis/composant/composant.component';

import { NavsComponent } from './Components/navs/navs.component';



registerLocaleData(localeFr);
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
    ListProjectComponent,
    EditProjectComponent,
    ShowProjectComponent,
    AddProjectComponent,
    AddNeedComponent,
    ProjectsFilterComponent,
    AreaComponent,
    ConfiguratorComponent,
    SummaryComponent,
    NavsComponent,
    ComposantComponent,
    ProjetComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    ResizableModule,
    NgSelectModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    DataTablesModule,
    PdfViewerModule,
  ],
  providers: [AuthApiService, AuthGuard,NgbActiveModal,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }, {
      provide: LOCALE_ID,
      useValue: 'fr-FR'
    }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule {
}
