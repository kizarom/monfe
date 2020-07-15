import { Component, OnInit, AfterViewInit, Injectable, Inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Project } from 'src/app/Models/project';
import { SalesQot } from 'src/app/Models/sales-qot';
import { Router} from '@angular/router';
import { ProjectFilterService } from 'src/app/Services/project-filter.service';
import { DatatableConfigurationService } from 'src/app/Services/datatable-configuration.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as XLSX from 'xlsx';
import {NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { ProjectSearch } from 'src/app/Models/project-search';
import { ContactApiService } from 'src/app/Services/contact-api.service';
import { Contact } from 'src/app/Models/contact';
import { AuthApiService } from 'src/app/Services/auth-api.service';
import { ListProjectComponent } from '../project/list-project/list-project.component';
import { Projet } from 'src/app/Models/projet';
import { DataTransferServiceService } from 'src/app/Services/data-transfer-service.service';


@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {

  readonly DELIMITER = '-';

  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      new Date(15, 7, 2020);
      let date = value.split(this.DELIMITER);
      return {
        day : parseInt(date[0], 10),
        month : parseInt(date[1], 10),
        year : parseInt(date[2], 10)
      };
    }
    return null;
  }

  toModel(date: NgbDateStruct | null): string | null {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : null;
  }
}

@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {

  readonly DELIMITER = '/';

  parse(value: string): NgbDateStruct | null {
    if (value) {
      let date = value.split(this.DELIMITER);
      return {
        day : parseInt(date[0], 10),
        month : parseInt(date[1], 10),
        year : parseInt(date[2], 10)
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : null;

  }
}

@Component({
  selector: 'app-projects-filter',
  templateUrl: './projects-filter.component.html',
  styleUrls: ['./projects-filter.component.scss'],
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})

export class ProjectsFilterComponent implements OnInit , AfterViewInit  {


 
  projectTable: DataTables.Settings = {};
  projects: Project[];
  project: Project = {
    title:'',
    adress:'',
    price:null,
    status: 'Nouveau',
    idClient: 0,
    created_at:new Date(15, 7, 2020)
    
  };
  projectsClient: Contact[];
  clientId: number;
  
  errorMessage:string;
  projectSearch:ProjectSearch = {};
  public isAdmin: boolean;
  projectResult: Project[];
  constructor(public activeModal: NgbActiveModal,
      private authApiService: AuthApiService,
      private projectService: ProjectFilterService,
      private contactService: ContactApiService,
      private dataTableConfiguration: DatatableConfigurationService, 
      private spinner: NgxSpinnerService,private ngbCalendar: NgbCalendar, 
      private dateAdapter: NgbDateAdapter<string>,
      private dataTransfer: DataTransferServiceService
  ){}

  ngOnInit(): void {
    this.getProjects();
    this.getProjectsClients()
    this.isAdmin = this.authApiService.getConnectedAdmin() || this.authApiService.isSuperAdmin();
  }

  shareData(data){
    this.dataTransfer.sendAnything(data)
  }

  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }

  ngAfterViewInit(){
    this.spinner.hide();
   }


   getProjects(){
    this.projectService.getAllProjects().subscribe((projectList: Project[]) => {
      this.projects = projectList ;  
      this.projectTable = this.dataTableConfiguration.getDatatableConfiguration();
      this.spinner.hide();
    });
   }

  getProjectsClients(){
    this.contactService.getAllContact().subscribe((clientList: Contact[]) => {
      this.projectsClient = clientList['hydra:member'].filter(contact => contact['roles'].includes('ROLE_USER'));
    });
  }

  save(form) {
    this.errorMessage = null;
    if (form.valid) {
      console.log(this.project);
      this.project.client = this.projectsClient.find(clt=> clt.id == this.clientId);
      
      this.projectService.projectFiltring(this.project).subscribe((projet: Project[]) => {
        console.log(projet);
        
        this.shareData(projet);
        this.activeModal.close();
      },
      error=>{
        console.log(error);
        if(error.status == 404 && error.error == "Ce projet n'existe pas !") 
          this.errorMessage = "Ce projet n'existe pas !"
      
        });
    }
  }






 clearForm(form) {

  form.reset({
        'title': '',
        'adress': '',
        'price': '',
        'status':'',
        'createdAt': '',
        'client': '',
       });
  }
}





