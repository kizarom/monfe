import { Injectable } from '@angular/core';
import {  Router} from '@angular/router';
import { AuthApiService } from './Services/auth-api.service';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private _authService: AuthApiService,
              private _router: Router) { }


  canActivate(next: ActivatedRouteSnapshot,
             state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
                
              if (this._authService.loggedIn()) {
                    console.log('true')
                    return true
               } else {
                     console.log('false')            
                     this._router.navigate(['/login'])
                     return false
                     }
  }

}

             


 

