import { Component, OnInit } from '@angular/core';
import { ContactApiService } from 'src/app/Services/contact-api.service';
import { Contact } from 'src/app/Models/contact';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-list-contacts',
  templateUrl: './list-contacts.component.html',
  styleUrls: ['./list-contacts.component.scss']
})
export class ListContactsComponent implements OnInit {
contacts:Contact[];
role = {ROLE_ADMIN: "Administrateur", ROLE_USER: "Utilisateur" ,ROLE_SUPER_ADMIN:"SuperAdmin"}

  constructor(private contactservice:ContactApiService) { }
  ngOnInit(): void {
    this.getListContacts();
  }
  getListContacts(){
    this.contactservice.getAllContact().subscribe((contactList: Contact[])=>{      
      this.contacts=contactList['hydra:member'];
  })
}

delete(id){
    Swal.fire({
      title: 'Etes vous sûre de vouloir supprimer cet user ?',
      text: "vous ne pourrez pas récupérer cet utilisateur",
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
        )
        this.getListContacts();
        })
      }
  })
}
}