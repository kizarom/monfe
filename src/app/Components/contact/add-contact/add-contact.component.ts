import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { AuthApiService } from 'src/app/Services/auth-api.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { Contact } from 'src/app/Models/contact';
import { ContactApiService } from 'src/app/Services/contact-api.service';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.scss'],
})

export class AddContactComponent implements OnInit, AfterContentChecked {
  isAdmin: boolean ;
  isSuperadmin: boolean;
  avatar: File;
  errMessage: String;
  imagePreview: any = 'assets/avatar-default.png';
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
    // tslint:disable-next-line:variable-name
    public _authService: AuthApiService,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {}

  save(form) {
    if (form.valid) {
      if (this.isAdmin) {
        this.contact.roles = ['ROLE_USER'];
      }
      const userData = new FormData();

      userData.append('avatar', this.avatar);
      userData.append('user', JSON.stringify(this.contact));

      this.contactservice.addContact(userData).subscribe((resp) => {
        this.activeModal.close();
      });
    }
  }


  getAvatar(avatar) {
    if (!avatar) { return; }
    this.avatar = avatar;
    let type = this.avatar.type;
    let size: number = this.avatar.size;
    if (type.match(/image\/*/) == null) {
      this.errMessage = 'Seulement les images de type (.jpg, .jpeg, .png) sont supporter !';
      return;
    }
    if (size > 2000000) {
      this.errMessage = 'La taille de l\'image ne doit pas dépasser 2Mo !';
      return;
    }
    let reader = new FileReader();
    reader.readAsDataURL(avatar);
    reader.onload = (_event) => {
      this.imagePreview = reader.result;
    };
  }
  dismissAlert() {
    this.errMessage = '';
  }
  setAvatarDefault() {
    this.imagePreview = 'assets/avatar-default.png';
    this.avatar = null;
  }
  ngAfterContentChecked() {
    this.isAdmin = this._authService.getConnectedAdmin();
    this.isSuperadmin = this._authService.isSuperAdmin();
  }



}
