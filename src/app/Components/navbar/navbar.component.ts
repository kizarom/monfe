
import { Component, OnInit, AfterViewInit, AfterContentChecked, AfterViewChecked, OnChanges, DoCheck } from '@angular/core';
import { AuthApiService } from 'src/app/Services/auth-api.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit, AfterViewChecked{

  public isAdmin: boolean;
  constructor(public _authService: AuthApiService){}

  ngOnInit(): void {
    this.isAdmin = this._authService.getConnectedAdmin();
    this.isAdmin = this._authService.getConnectedAdmin() || this._authService.isSuperAdmin();
  }
  
  
  
  ngAfterViewChecked() {
      this.isAdmin = this._authService.getConnectedAdmin() || this._authService.isSuperAdmin();
   
      // this.ngZone.runOutsideAngular(() => {
      //   setTimeout(() => {        
       //     console.log("is admin", this.isAdmin);
       //   }, 0);
       // });
    }

   logOut(){
     this.isAdmin = false ;
     return this._authService.logoutUser();
   }
   

   isConnected(){
    return this._authService.loggedIn();
   }

  





}



