
import { Component, OnInit, AfterContentChecked } from '@angular/core';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import { AuthApiService } from 'src/app/Services/auth-api.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { Contact } from 'src/app/Models/contact';
import { ContactApiService } from 'src/app/Services/contact-api.service';

@Component({
  selector: 'app-edit-contact',
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.scss'],
})
export class EditContactComponent implements OnInit, AfterContentChecked {

  isAdmin: boolean ;
  isSuperadmin: boolean;
  avatar: File;
  errMessage: string;
  avatarDeleted: boolean = false;
  imagePreview: any = 'assets/avatar-default.png';
  isLoading = false;
  contact: Contact;
  form: FormGroup;
  id: number;
  constructor(
    private contactservice: ContactApiService,
    public _authService: AuthApiService,
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder
  ) {}

  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }
  get first_name() { return this.form.get('first_name') }
  get last_name() { return this.form.get('last_name') }
  get roles() { return this.form.get('roles') }

  ngOnInit(): void {
    this.setForm();
  }

  get editFormData() {
    return this.form.controls;
  }

  private setForm() {
    this.id = this.contact.id;
    this.imagePreview = this.contact.avatar_path;
    this.form = this.formBuilder.group({
      email: new FormControl(this.contact.email, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]),
      password: new FormControl('', [Validators.minLength(6)]),
      first_name: new FormControl(this.contact.first_name, [Validators.required]),
      last_name: new FormControl(this.contact.last_name, [Validators.required]),
      roles: new FormControl(this.contact.roles[0], [Validators.required])
    });
  }

  ngAfterContentChecked() {
    this.isAdmin = this._authService.getConnectedAdmin();
    this.isSuperadmin = this._authService.isSuperAdmin();
  }

  getAvatar(avatar){
    if (!avatar) { return; }
    this.errMessage = '';
    this.avatar = avatar;
    this.avatarDeleted = false;
    var type = this.avatar.type;
    var size: number = this.avatar.size;
    if (type.match(/image\/*/) == null) {
      this.errMessage = 'Seulement les images de type (.jpg, .jpeg, .png) sont supporter !';
      return;
    }
    if (size > 2000000){
      this.errMessage = 'La taille de l\'image ne doit pas dépasser 2Mo !';
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(avatar);
    reader.onload = (_event) => {
      this.imagePreview = reader.result;
    };
  }

  dismissAlert() {
    this.errMessage = '';
  }
  setAvatarDefault(){
    this.imagePreview = 'assets/avatar-default.png'
    this.avatar = null;
    this.avatarDeleted = true;
  }
  edit() {
    if (this.form.valid) {
      console.log(this.form.value);

      this.isLoading = true;
      this.form.value.roles = Array(this.form.value.roles);
      if (this.isAdmin) {
        this.form.value.roles = Array('ROLE_USER');
      }
      const userData = new FormData();
      userData.append('avatar', this.avatar);
      userData.append('avatarDeleted', JSON.stringify(this.avatarDeleted));
      userData.append('user', JSON.stringify(this.form.value));
      this.contactservice
        .editContact(userData, this.id)
        .subscribe((resp) => {
          this.activeModal.close();
        });
    }
  }
}
