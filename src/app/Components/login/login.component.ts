import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthApiService } from 'src/app/Services/auth-api.service';
import { Router } from "@angular/router";
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import * as jwt_decode from 'jwt-decode';
import { HttpResponse } from '@angular/common/http';




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  passwordError: String
  loginForm: FormGroup
  loginUserData = {
    username: "",
    password: "",
  }

  constructor(private _auth: AuthApiService,
              private _router: Router,
              private fb: FormBuilder) {

                let formControls = {
                  username: new FormControl('',[
                    Validators.required,
                   	Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"),
                  ]),
                  password: new FormControl('',[
                    Validators.required,
                    Validators.pattern("[A-Za-z .'-]+"),
                    Validators.minLength(6)
                  ]),
               }
               this.loginForm = this.fb.group(formControls)
  }

   get username() { return this.loginForm.get('username') }
   get password() { return this.loginForm.get('password') }

  ngOnInit(): void {
    this.loginForm.setValue({
     username: this.loginUserData.username,
     password: this.loginUserData.password,
    });

  }



  loginUser (){
      console.log(this.loginForm.value);

      this._auth.loginUser(this.loginForm.value)
      .subscribe((res: HttpResponse<any>) => {
        console.log(res);
        if (res.status === 200) {
          // we have logged in successfully
          localStorage.getItem('token')
          localStorage.getItem('refresh_token')

          var decodedToken = jwt_decode(res.body.token);
              if(decodedToken['roles'].includes('ROLE_ADMIN')){
                this._router.navigate(['contacts'])
              }else{
                this._router.navigate(['projets']);
              }


        }
      });
  }



}
