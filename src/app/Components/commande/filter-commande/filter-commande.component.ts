import { Component, OnInit, Injectable } from '@angular/core';
import { Project } from 'src/app/Models/project';
import { Order } from 'src/app/Models/Order';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderApiService } from 'src/app/Services/order-api.service';
import { DataTransferServiceService } from 'src/app/Services/data-transfer-service.service';
import { ContactApiService } from 'src/app/Services/contact-api.service';
import { Contact } from 'src/app/Models/contact';
import { AuthApiService } from 'src/app/Services/auth-api.service';
import {NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {

  readonly DELIMITER = '-';

  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      new Date(15, 7, 2020);
      let date = value.split(this.DELIMITER);
      
      return {
        day : parseInt(date[0], 10),
        month : parseInt(date[1], 10),
        year : parseInt(date[2], 10)
      };
    }
    return null;
  }

  toModel(date: NgbDateStruct | null): string | null {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : null;
  }
}

@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {

  readonly DELIMITER = '/';

  parse(value: string): NgbDateStruct | null {
    if (value) {
      let date = value.split(this.DELIMITER);
      
      return {
        day : parseInt(date[0], 10),
        month : parseInt(date[1], 10),
        year : parseInt(date[2], 10)
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : null;

  }
}

@Component({
  selector: 'app-filter-commande',
  templateUrl: './filter-commande.component.html',
  styleUrls: ['./filter-commande.component.scss'],
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class FilterCommandeComponent implements OnInit {

  constructor(
     public activeModal: NgbActiveModal,
     public orderApiService:OrderApiService,
     private contactService: ContactApiService,
     private dataTransfer: DataTransferServiceService,
     private authApiService: AuthApiService
     ) { }
  errorMessage;
  project:Project;
  order:Order = {
    type:"",
    status:"",
    project:"",
    components:null,
    created_at:"",
    client: "",
    price:0
  };
  clients:Contact;
  commandeType:String;
  isAdmin: boolean;
  ngOnInit(): void {
    this.getClients();
    this.isAdmin = this.authApiService.getConnectedAdmin() || this.authApiService.isSuperAdmin();
  }

  getClients(){
    this.contactService.getAllContact().subscribe((clientList: Contact[]) => {
      this.clients = clientList['hydra:member'].filter(contact => contact['roles'].includes('ROLE_USER'));
    });
  }

  onCommandeTypeChange(e){
   this.commandeType = e.target.value;
    
  }

  shareData(data){
    this.dataTransfer.sendAnything(data)
  }

  save() {
    this.errorMessage = null;
    console.log(this.order);
    
    this.orderApiService.filterOrder(this.order).subscribe((order: Project[]) => {
      this.shareData(order);
      console.log(order);
      
      this.activeModal.close();
    },
    error=>{
      console.log(error);
      if(error.status == 404 && error.error == "Cette commande n'existe pas !") 
        this.errorMessage = "Cette commande n'existe pas !"
    
    });
  }

  clearForm(form) {
    form.reset();
  }

}
