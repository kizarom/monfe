import { Component, OnInit } from '@angular/core';
import { PanelApiService } from 'src/app/Services/panel-api.service';
import { Router } from '@angular/router';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { Panel } from 'src/app/Models/panel';

@Component({
  selector: 'app-add-panel',
  templateUrl: './add-panel.component.html',
  styleUrls: ['./add-panel.component.scss']
})
export class AddPanelComponent implements OnInit {
  panel:Panel = {
    type:"",
    description:"",
    price: 0
  };
  constructor(
    private panelservice:PanelApiService,
    private router: Router,
    public activeModal: NgbActiveModal

  ) { }

  ngOnInit(): void {
  }
  save(form) {
    if (form.valid) {
      this.panelservice.addPanel(this.panel).subscribe((resp) => {
        this.activeModal.close();
      });
    }
  }




}
