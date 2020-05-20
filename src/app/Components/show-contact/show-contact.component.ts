import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactApiService } from 'src/app/Services/contact-api.service';
import { Contact } from 'src/app/Models/contact';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-show-contact',
  templateUrl: './show-contact.component.html',
  styleUrls: ['./show-contact.component.scss']
})
export class ShowContactComponent implements OnInit {
  role = {ROLE_ADMIN: 'Administrateur', ROLE_USER: 'Utilisateur', ROLE_SUPER_ADMIN: 'Super administrateur' };
  contact: Contact = {
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    avatar_path: '',
    roles: [''],
  };
  id: string;

  constructor(private contactservice: ContactApiService, private route: ActivatedRoute,
              public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
     this.contactservice.getOneContact(this.id).subscribe((contact: Contact) => {
      this.contact = contact;
    });
  }

  delete(id){
    Swal.fire({
      title: 'Etes vous sûre de vouloir supprimer cet user ?',
      text: 'vous ne pourrez pas récupérer cet utilisateur',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui Supprimé'
    }).then((result) => {
      if (result.value) {
        this.contactservice.deleteContact(id).subscribe(()=>{
        Swal.fire(
          'supprimé!',
          'votre contact est supprimé avec succès',
          'success'
        );
        this.activeModal.close();
        });
      }
  })
}

}
