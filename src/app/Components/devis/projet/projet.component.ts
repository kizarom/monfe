import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Contact } from 'src/app/Models/contact';
import { ContactApiService } from 'src/app/Services/contact-api.service';
import { Router } from '@angular/router';
import { Projet } from 'src/app/Models/projet';
import { AddContactComponent } from '../../contact/add-contact/add-contact.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-projet',
  templateUrl: './projet.component.html',
  styleUrls: ['./projet.component.scss']
})
export class ProjetComponent implements OnInit, AfterViewInit {
  st:boolean;
  projet:Projet={
    title:"",
    client:{},
    adress:"",
    city:"",
    postalcode:"",
    price: 0
  };
  idClient:any;

  contacts:Contact[];
  constructor(private contactservice:ContactApiService,
    private router: Router,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService
    ) { }
    
  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.getListContacts();
    if(JSON.parse(sessionStorage.getItem("projet"))){
      this.projet = JSON.parse(sessionStorage.getItem("projet"));
      this.projet['price'] = 0;
      this.idClient  =  JSON.parse(sessionStorage.getItem("projet")).client.id;
    }
  }
  getListContacts(){
    this.contactservice.getAllContact().subscribe((contactList: Contact[])=>{ 
      this.contacts = contactList['hydra:member'].filter(contact => contact['roles'].includes('ROLE_USER'));
    })
  }
  save(form) {
      this.projet.client = this.contacts.find(contact=> contact.id == this.idClient);
      sessionStorage.setItem("projet",JSON.stringify(this.projet));
      this.router.navigateByUrl("create/project/areas"); 
  }
  create() {
    const modalRef = this.modalService.open(AddContactComponent, {
      centered: true,
      backdrop: 'static'
    });
    modalRef.result.then(
      (yes) => {
        modalRef.close();
        this.spinner.show();
        this.contacts = null;
        this.getListContacts();
      },
      (cancel) => {
        modalRef.close();
      }
    );
  }
}
