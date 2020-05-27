import { Component, OnInit, AfterViewInit } from '@angular/core';
import { GammeApiService } from 'src/app/Services/gamme-api.service';
import { Gamme } from 'src/app/Models/gamme';
import Swal from 'sweetalert2';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ShowGammeComponent} from '../show-gamme/show-gamme.component';
import {AddGammeComponent} from '../add-gamme/add-gamme.component';
import {EditGammeComponent} from '../edit-gamme/edit-gamme.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatatableConfigurationService } from 'src/app/Services/datatable-configuration.service';


@Component({
  selector: 'app-list-gammes',
  templateUrl: './list-gammes.component.html',
  styleUrls: ['./list-gammes.component.scss']
})
export class ListGammesComponent implements OnInit, AfterViewInit {

  gammes: Gamme[];
  gamme: Gamme = {
    title:'',
  };
  gammeTable: DataTables.Settings = {};

  constructor(
    private gammeService: GammeApiService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private dataTableConfiguration: DatatableConfigurationService
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    this.getListGammes();

  }
    
  ngAfterViewInit(){
    this.spinner.hide();
   }

  getListGammes() {
    this.gammeService.getAllGamme().subscribe((gammeList: Gamme[]) => {
      this.gammes = gammeList;
      this.gammeTable = this.dataTableConfiguration.getDatatableConfiguration();

    });
  }

  delete(id) {
    Swal.fire({
      title: 'Etes vous sûre de vouloir supprimer cet gamme ?',
      text: 'vous ne pourrez pas récupérer cet gamme',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui Supprimé'
    }).then((result) => {
      if (result.value) {
        this.gammeService.deleteGamme(id).subscribe(() => {
          Swal.fire(
            'supprimé!',
            'votre gamme est supprimé avec succès',
            'success'
          );
          this.getListGammes();
        });
      }
    });
  }

  create() {
    const modalRef = this.modalService.open(AddGammeComponent, {
      centered: true,
      backdrop: 'static'
    });
    modalRef.result.then(
      (yes) => {
        modalRef.close();
        this.getListGammes();
      },
      (cancel) => {
        modalRef.close();
      }
    );
  }

  edit(gamme: Gamme) {
    const modalRef = this.modalService.open(EditGammeComponent, { centered: true });
    modalRef.componentInstance.gamme = gamme;
    modalRef.result.then((yes) => {
      modalRef.close();
      this.getListGammes();
    }, (error) => {
      console.log(error);
    });
  }

  show(id) {
    const modalRef = this.modalService.open(ShowGammeComponent, {
      centered: true,
      backdrop: 'static'
    });
    modalRef.componentInstance.id = id;
  }

}
