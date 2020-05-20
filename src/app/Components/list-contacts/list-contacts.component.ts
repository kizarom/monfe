import {Component, OnInit} from '@angular/core';
import { ContactApiService } from 'src/app/Services/contact-api.service';
import { Contact } from 'src/app/Models/contact';
import Swal from 'sweetalert2';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ShowContactComponent} from '../show-contact/show-contact.component';
import {AddContactComponent} from '../add-contact/add-contact.component';
import {EditContactComponent} from '../edit-contact/edit-contact.component';

@Component({
  selector: 'app-list-contacts',
  templateUrl: './list-contacts.component.html',
  styleUrls: ['./list-contacts.component.scss']
})
export class ListContactsComponent implements OnInit {
  contacts: Contact[];
  role = {ROLE_ADMIN: 'Administrateur', ROLE_USER: 'Utilisateur' , ROLE_SUPER_ADMIN: 'SuperAdmin'};
  contact: Contact = {
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    avatar_path: '',
    roles: [''],
  };

  constructor(
    private contactservice: ContactApiService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.getListContacts();
  }

  getListContacts() {
    this.contactservice.getAllContact().subscribe((contactList: Contact[]) => {
      this.contacts = contactList['hydra:member'];
    });
  }

  delete(id) {
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
        this.contactservice.deleteContact(id).subscribe(() => {
          Swal.fire(
            'supprimé!',
            'votre contact est supprimé avec succès',
            'success'
          );
          this.getListContacts();
        });
      }
    });
  }

  create() {
    const modalRef = this.modalService.open(AddContactComponent, {
      centered: true,
      backdrop: 'static'
    });
    modalRef.result.then(
      (yes) => {
        modalRef.close();
        this.getListContacts();
      },
      (cancel) => {
        modalRef.close();
      }
    );
  }

  edit(contact: Contact) {
    const modalRef = this.modalService.open(EditContactComponent, { centered: true });
    modalRef.componentInstance.contact = contact;
    modalRef.result.then((yes) => {
      modalRef.close();
      this.getListContacts();
    }, (error) => {
      console.log(error);
    });
  }

  show(id) {
    const modalRef = this.modalService.open(ShowContactComponent, {
      centered: true,
      backdrop: 'static'
    });
    modalRef.componentInstance.id = id;
  }
}
