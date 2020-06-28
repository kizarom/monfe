import { Component, OnInit } from '@angular/core';
import { PanelApiService } from 'src/app/Services/panel-api.service';
import { ActivatedRoute } from '@angular/router';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { Panel } from 'src/app/Models/panel';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-show-panel',
  templateUrl: './show-panel.component.html',
  styleUrls: ['./show-panel.component.scss']
})
export class ShowPanelComponent implements OnInit {
  panel:Panel = {
    type:"",
    description:"",
    price: 0
  };
  id: string;

  constructor(
    private panelservice:PanelApiService,
    private route: ActivatedRoute,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.panelservice.getOnePanel(this.id).subscribe((panel: Panel) => {
      this.panel = panel;
    });
  }
  delete(id){
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
        this.panelservice.deletePanel(id).subscribe(()=>{
        Swal.fire(
          'supprimé!',
          'votre panneau est supprimé avec succès',
          'success'
        );
        });
        this.activeModal.close();
      }
  })
}

}
