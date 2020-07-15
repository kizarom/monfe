import { DatableConfAlternativeService } from 'src/app/Services/datable-conf-alternative.service';
import { DatatableConfigurationService } from 'src/app/Services/datatable-configuration.service';
import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { Project } from 'src/app/Models/project';
import { AuthApiService } from 'src/app/Services/auth-api.service';
import { ProjectApiService } from 'src/app/Services/project-api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ShowProjectComponent } from '../show-project/show-project.component';
import { Router } from '@angular/router';
import { ProjectsFilterComponent } from '../../projects-filter/projects-filter.component';
import * as XLSX from 'xlsx';
import { DataTransferServiceService } from 'src/app/Services/data-transfer-service.service';
import {CheckOrdersComponent} from "../../orders/check-orders/check-orders.component";
declare var $: JQueryStatic;

@Component({
  selector: 'app-list-project',
  templateUrl: './list-project.component.html',
  styleUrls: ['./list-project.component.scss']
})
export class ListProjectComponent implements OnInit, AfterContentChecked {


  // click : boolean = false;
  projects: Project[];
  public isAdmin: boolean;
  projectTable: DataTables.Settings = {};

  constructor(
    private authApiService: AuthApiService,
    private projectApiService: ProjectApiService,
    private dataTableConfig: DatableConfAlternativeService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private router: Router,
    private dataTransfer: DataTransferServiceService
  ) { }

  ngOnInit(): void {
    this.isAdmin = this.authApiService.getConnectedAdmin();
    this.isAdmin = this.authApiService.getConnectedAdmin() || this.authApiService.isSuperAdmin();
    this.getProjects();
  }

  ngAfterContentChecked(): void {
    this.isAdmin = this.authApiService.getConnectedAdmin();
    this.isAdmin = this.authApiService.getConnectedAdmin() || this.authApiService.isSuperAdmin();
  }

  updateStatus(status, id) {
    this.projectApiService.updateStatus(status.value, id).subscribe(() => {
      this.getProjects();
    });

  }

  getDate(_date) {
    const date = new Date(_date);
    const year = date.getFullYear();
    let month: any = date.getMonth() + 1;
    let day: any = date.getDate() + 1;

    if (day < 10) {
      day = '0' + day;
    }
    if (month < 10) {
      month = '0' + month;
    }

    return day + '-' + month + '-' + year;
  }

  getProjects() {
    this.spinner.show();
    return this.projectApiService
      .getProjectsList()
      .subscribe((projectList: Project[]) => {
        console.log(projectList);
        this.projects = projectList;
        this.projectTable = this.dataTableConfig.getDatatableConfiguration();
        this.spinner.hide();
      });
  }


  filter() {


    const modalRef = this.modalService.open(ProjectsFilterComponent, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
    });
    // modalRef.componentInstance.project = project;
    modalRef.result.then(
      () => {
        this.dataTransfer.project.subscribe(res => this.projects = res);
        modalRef.close();
        // this.getProjects();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  exporter() {
    const element = document.getElementById('projet_mondevis');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'projetsMonDevis.xlsx');
  }

  delete(id: any) {
    Swal.fire({
      title: 'Êtes-vous sûre de vouloir supprimer ce projet ?',
      text: 'Cet action est irréversible',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Supprimer',
    }).then((result) => {
      if (result.value) {
        this.projectApiService.deleteProduct(id).subscribe(() => {
          Swal.fire(
            'C\'est supprimé',
            'votre projet est supprimé avec succès',
            'success'
          );
          this.spinner.show();
          this.projects = null;
          this.getProjects();
        });
      }
    });
  }

  create() {
    sessionStorage.removeItem('projet');
    sessionStorage.removeItem('areas');
    sessionStorage.removeItem('areasData');
    sessionStorage.removeItem('needs');
    sessionStorage.removeItem('configurators');
    sessionStorage.removeItem('composants');
    sessionStorage.removeItem('idQuote');
    sessionStorage.removeItem('idProject');
    sessionStorage.removeItem('isUpdate');
    this.router.navigateByUrl('create/project/info');
  }

  edit(project: Project) {
    sessionStorage.setItem('projet', JSON.stringify(project._project_data));
    sessionStorage.setItem('areas', JSON.stringify(project._areas));
    sessionStorage.setItem('areasData', JSON.stringify(project._areas_data));
    sessionStorage.setItem('needs', JSON.stringify(project._needs_data));
    sessionStorage.setItem('configurators', JSON.stringify(project._configurtors_data));
    sessionStorage.setItem('composants', JSON.stringify(project._components_data));
    sessionStorage.setItem('idQuote', JSON.stringify(project.sales_qotes[0].id));
    sessionStorage.setItem('isUpdate', 'true');
    sessionStorage.setItem('idProject', JSON.stringify(project.id));
    this.router.navigateByUrl('create/project/info');
  }

  show(id: any) {
    const modalRef = this.modalService.open(ShowProjectComponent, {
      centered: true,
      backdrop: 'static',
    });
    modalRef.componentInstance.id = id;
    modalRef.result.then(
      () => {
        modalRef.close();
        this.spinner.show();
        this.projects = null;
        this.getProjects();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  checkOrder(id) {
    const modalRef = this.modalService.open(CheckOrdersComponent, {
      centered: true,
      backdrop: 'static',
    });
    modalRef.componentInstance.id = id;
    modalRef.result.then(
      () => {
        modalRef.close();
        this.spinner.show();
        this.projects = null;
        this.getProjects();
      }, (error) => {
        console.log(error);
      }
    );
  }

  hideArea(id: number) {
    $('tr.area_' + id).fadeToggle();
    if ($('i.toggle_' + id).hasClass('fa-arrow-right')) {
      $('i.toggle_' + id).removeClass('fa-arrow-right').addClass('fa-arrow-down');
    } else {
      $('i.toggle_' + id).removeClass('fa-arrow-down').addClass('fa-arrow-right');
    }
  }

}
