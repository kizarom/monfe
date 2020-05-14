import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContactApiService } from 'src/app/Services/contact-api.service';
import { Contact } from 'src/app/Models/contact';

@Component({
  selector: 'app-show-contact',
  templateUrl: './show-contact.component.html',
  styleUrls: ['./show-contact.component.scss']
})
export class ShowContactComponent implements OnInit {
  id:string;
  role = {ROLE_ADMIN: "Administrateur", ROLE_USER: "Utilisateur",ROLE_SUPER_ADMIN:"SuperAdmin" }
  contact:Contact= {
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    roles: [''],
  };
  objt = {ROLE_ADMIN: 'Administrateur'}
  
  constructor(private contactservice:ContactApiService, private route:ActivatedRoute) { }

  ngOnInit(): void {
     this.id = this.route.snapshot.params.id;
     this.contactservice.getOneContact(this.id).subscribe((contact:Contact)=>{
      this.contact=contact;
    })
  }

}