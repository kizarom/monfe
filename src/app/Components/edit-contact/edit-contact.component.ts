import { Component, OnInit, AfterContentChecked } from "@angular/core";
import { ContactApiService } from "src/app/Services/contact-api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Contact } from "src/app/Models/contact";
import { AuthApiService } from "src/app/Services/auth-api.service";

@Component({
  selector: "app-edit-contact",
  templateUrl: "./edit-contact.component.html",
  styleUrls: ["./edit-contact.component.scss"],
})
export class EditContactComponent implements OnInit, AfterContentChecked {
  isAdmin: boolean ;
  isSuperadmin:boolean;

  form = new FormGroup({
    email: new FormControl("", [Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]),
    password: new FormControl("",[Validators.minLength(6)]),
    first_name: new FormControl("", [Validators.required]),
    last_name: new FormControl("", [Validators.required]),
    roles: new FormControl("", [Validators.required]),
  });
  id: string;
  constructor(
    private contactservice: ContactApiService,
    private router: Router,
    private route: ActivatedRoute,
    public _authService: AuthApiService
  ) {}
  get email() { return this.form.get('email') }
  get password() { return this.form.get('password') }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.contactservice.getOneContact(this.id).subscribe((contact: Contact) => {
      let { email,first_name, last_name, roles } = contact;
      this.form.setValue({
        email: email,
        roles: roles[0],
        password: "",
        first_name: first_name,
        last_name: last_name,
      });
    });
  }

  ngAfterContentChecked(){
    this.isAdmin=this._authService.getConnectedAdmin();
    this.isSuperadmin=this._authService.isSuperAdmin();

  }

  edit() {
    if (this.form.valid) {
    this.form.value.roles = Array(this.form.value.roles);
    console.log(this.form.value);
      if(this.isAdmin){
        this.form.value.roles = Array("ROLE_USER");
      }
      this.contactservice
        .editContact(this.form.value, this.id)
        .subscribe(() => {
          this.router.navigateByUrl("/contacts");
        });
    }
  }
}
