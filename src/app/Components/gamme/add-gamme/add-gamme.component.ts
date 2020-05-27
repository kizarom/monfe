import { Component, OnInit } from '@angular/core';
import { GammeApiService } from 'src/app/Services/gamme-api.service';
import { Gamme } from 'src/app/Models/gamme';
import { Router} from '@angular/router';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-gamme',
  templateUrl: './add-gamme.component.html',
  styleUrls: ['./add-gamme.component.scss']
})
export class AddGammeComponent implements OnInit {

  gamme: Gamme = {
    title: '',
  };

  constructor(
    private gammeservice: GammeApiService,
    private router: Router,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
  }

  save(form) {
    if (form.valid) {
      this.gammeservice.addGamme(this.gamme).subscribe((resp) => {
        this.activeModal.close();
      });
    }
  }

  


}
