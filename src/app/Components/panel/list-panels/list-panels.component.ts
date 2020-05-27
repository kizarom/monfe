import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PanelApiService } from 'src/app/Services/panel-api.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { Panel } from 'src/app/Models/panel';
import Swal from 'sweetalert2';
import { AddPanelComponent } from '../add-panel/add-panel.component';
import { EditPanelComponent } from '../edit-panel/edit-panel.component';
import { ShowPanelComponent } from '../show-panel/show-panel.component';
import { DatatableConfigurationService } from 'src/app/Services/datatable-configuration.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-list-panels',
  templateUrl: './list-panels.component.html',
  styleUrls: ['./list-panels.component.scss']
})
export class ListPanelsComponent implements OnInit, AfterViewInit {
  panels: Panel[];
  panel:Panel = {
    type:"",
    description:"",
  };
  panelTable: DataTables.Settings = {};
  constructor(
    private panelservice:PanelApiService,
    private modalService: NgbModal,
    private dataTableConfiguration: DatatableConfigurationService,
    private spinner: NgxSpinnerService,
    ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.getListPanels();
  }

  ngAfterViewInit(){
    this.spinner.hide();
   }


  getListPanels(){
    this.panelservice.getAllPanel().subscribe((PanelList: Panel[]) => {
      this.panels = PanelList;
      this.panelTable = this.dataTableConfiguration.getDatatableConfiguration();
    });
  }
  delete(id) {
    Swal.fire({
      title: 'Etes vous sûre de vouloir supprimer cet panneau ?',
      text: 'vous ne pourrez pas récupérer cet panneau',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui Supprimé'
    }).then((result) => {
      if (result.value) {
        this.panelservice.deletePanel(id).subscribe(() => {
          Swal.fire(
            'supprimé!',
            'votre panneau est supprimé avec succès',
            'success'
          );
          this.getListPanels();
        });
      }
    });
  }

  create() {
    const modalRef = this.modalService.open(AddPanelComponent, {
      centered: true,
      backdrop: 'static'
    });
    modalRef.result.then(
      (yes) => {
        modalRef.close();
        this.getListPanels();
      },
      (cancel) => {
        modalRef.close();
      }
    );
  }

  edit(panel: Panel) {
    const modalRef = this.modalService.open(EditPanelComponent, { centered: true });
    modalRef.componentInstance.panel = panel;
    modalRef.result.then((yes) => {
      modalRef.close();
      this.getListPanels();
    }, (error) => {
      console.log(error);
    });
  }

  show(id) {
    const modalRef = this.modalService.open(ShowPanelComponent, {
      centered: true,
      backdrop: 'static'
    });
    modalRef.componentInstance.id = id;
  }


}
