import { Component, OnInit, AfterContentChecked } from "@angular/core";
import { ContactApiService } from "src/app/Services/contact-api.service";
import { Contact } from "src/app/Models/contact";
import { Router } from "@angular/router";
import { AuthApiService } from "src/app/Services/auth-api.service";

@Component({
  selector: "app-add-contact",
  templateUrl: "./add-contact.component.html",
  styleUrls: ["./add-contact.component.scss"],
})

export class AddContactComponent implements OnInit, AfterContentChecked {
  isAdmin: boolean ;
  isSuperadmin:boolean;
  contact: Contact = {
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    roles: [""],
  };

  constructor(
    private contactservice: ContactApiService,
    private router: Router,
    public _authService: AuthApiService
  ) {}

  ngOnInit(): void {}
  save(form) {
    if (form.valid) {
      if(this.isAdmin){
        this.contact.roles=["ROLE_USER"]
      }
      this.contactservice.addContact(this.contact).subscribe(() => {
        this.router.navigateByUrl("/contacts");
      });
    }
  }

  ngAfterContentChecked(){
    this.isAdmin=this._authService.getConnectedAdmin();
    this.isSuperadmin=this._authService.isSuperAdmin();
  }

}
