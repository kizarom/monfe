import { Component, OnInit } from '@angular/core';
import { ComponentApiService } from 'src/app/Services/component-api.service';
import { ComponentInterface } from 'src/app/Models/ComponentInterface';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-show-compenent',
  templateUrl: './show-compenent.component.html',
  styleUrls: ['./show-compenent.component.scss']
})
export class ShowCompenentComponent implements OnInit {

  constructor(
    private componentService: ComponentApiService,
    public activeModal: NgbActiveModal) { }
  component: ComponentInterface;
  id:number;
  componentsType = {
    Recepteursolaire: "Recepteur solaire",
    Integration: "Intégration",
    Quincaillerie: "Quincaillerie",
    Aerolique: "Aérolique",
    Hydraulique: "Hydraulique",
    Electrique: "Électrique"
  }
  ngOnInit(): void {
    this.componentService.getOneComponent(this.id).subscribe((component: ComponentInterface) => {
      this.component = component;
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
          this.activeModal.close();
        });
      }
    });
  }


}
