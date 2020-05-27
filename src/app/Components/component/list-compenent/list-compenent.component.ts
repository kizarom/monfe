import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ComponentApiService } from 'src/app/Services/component-api.service';
import Swal from 'sweetalert2';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { AddCompenentComponent } from '../add-compenent/add-compenent.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ComponentInterface } from 'src/app/Models/ComponentInterface';
import { EditCompenentComponent } from '../edit-compenent/edit-compenent.component';
import { ShowCompenentComponent } from '../show-compenent/show-compenent.component';
import { DatatableConfigurationService } from 'src/app/Services/datatable-configuration.service';

@Component({
  selector: 'app-list-compenent',
  templateUrl: './list-compenent.component.html',
  styleUrls: ['./list-compenent.component.scss']
})
export class ListCompenentComponent implements OnInit, AfterViewInit{

  constructor(
    private componentService: ComponentApiService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private dataTableConfiguration: DatatableConfigurationService
  ) { }

  components: ComponentInterface[];
  componentTable: DataTables.Settings = {};

  ngOnInit(): void {
    this.spinner.show();
    this.getListComponent();
  }

  
  ngAfterViewInit(){
    this.spinner.hide();
   }

  getListComponent() {     
    this.componentService.getAllComponent().subscribe((componentsList: ComponentInterface[]) => {
      this.components = componentsList;
      this.componentTable = this.dataTableConfiguration.getDatatableConfiguration();
      this.spinner.hide();
    });
  }

  delete(id) {
    Swal.fire({
      title: 'Etes vous sûre de vouloir supprimer ce composant ?',
      text: 'vous ne pourrez pas récupérer ce composant',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui Supprimé'
    }).then((result) => {
      if (result.value) {
        this.componentService.deleteComponent(id).subscribe(() => {
          Swal.fire(
            'supprimé!',
            'le composant a été supprimé avec succès',
            'success'
          );
          this.spinner.show();
          this.components = null;
          this.getListComponent();
        });
      }
    });
  }

  create() {
    const modalRef = this.modalService.open(AddCompenentComponent, {
      centered: true,
      backdrop: 'static'
    });
    modalRef.result.then(
      (yes) => {
        modalRef.close();
        this.spinner.show();
        this.components = null;
        this.getListComponent();
      },
      (cancel) => {
        modalRef.close();
      }
    );
  }

  edit(component: ComponentInterface) {    
    const modalRef = this.modalService.open(EditCompenentComponent, { centered: true, backdrop: 'static' });
    modalRef.componentInstance.component = component;
    modalRef.result.then((yes) => {
      modalRef.close();
      this.getListComponent();
    }, (error) => {
      console.log(error);
    });
  }

  show(id) {
    const modalRef = this.modalService.open(ShowCompenentComponent, {
      centered: true,
      backdrop: 'static'
    });
    modalRef.componentInstance.id = id;
    modalRef.result.then((yes) => {
      modalRef.close();
      this.spinner.show();
      this.components = null;
      this.getListComponent();
    }, (error) => {
      console.log(error);
    });
  }
}
