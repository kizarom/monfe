import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { GammeApiService } from 'src/app/Services/gamme-api.service';
import { Gamme } from 'src/app/Models/gamme';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-show-gamme',
  templateUrl: './show-gamme.component.html',
  styleUrls: ['./show-gamme.component.scss']
})
export class ShowGammeComponent implements OnInit {


  gamme: Gamme = {
    title:'',
  };
  id: string;
  constructor(
    private gammeService: GammeApiService,
    private route: ActivatedRoute,
    public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.gammeService.getOneGamme(this.id).subscribe((gamme: Gamme) => {
      this.gamme = gamme;
  });
}


delete(id){
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
      this.gammeService.deleteGamme(id).subscribe(()=>{
      Swal.fire(
        'supprimé!',
        'votre gamme est supprimé avec succès',
        'success'
      );
      this.activeModal.close();
      });
    }
})
}

}
