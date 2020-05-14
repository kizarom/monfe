import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthApiService } from './Services/auth-api.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(public auth: AuthApiService, public router: Router) {}
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      const isAuthorized = this.auth.getConnectedAdmin() || this.auth.isSuperAdmin();

      if( !this.auth.loggedIn()){
        this.router.navigate(['login']);
        return false;
      }
      if(!isAuthorized){
        this.router.navigate(['/']);
        return false;
      }

      return true;
  }
  
}
