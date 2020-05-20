import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import { shareReplay, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthApiService {

  private _loginUrl = 'http://localhost:8000/api/login_check';

  constructor(private http: HttpClient,private _router: Router) {}

    loginUser(user) {
      return this.http.post<any>(this._loginUrl, user, {observe: 'response'}).pipe(
        shareReplay(),
        tap((res: HttpResponse<any>) => {
          // the auth tokens will be in the body of this response
          this.storeTokens(res.body.token, res.body.refresh_token);
          console.log('LOGGED IN!');
        })
      )
    }

    private storeTokens(accessToken: string, refreshToken: string) {
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
    }

    private removeTokens() {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
    }

    logoutUser() {
          this.removeTokens();
          this._router.navigate(['/login']);
    }

    loggedIn() {
      let token = localStorage.getItem('token');
      if (token) {
        return true;
      } else {
        return false;
      }
    }

    setToken(accessToken: string) {
      localStorage.setItem('token', accessToken);
    }

    getToken(): string {
       return localStorage.getItem('token');
    }

    getRefreshToken() {
      return localStorage.getItem('refresh_token');
    }

    // return new token
    getNewToken() {
      return this.http.post<any>('http://localhost:8000/api/token/refresh',
        {
          'refresh_token': this.getRefreshToken()
        },
        {observe: 'response'}).pipe(tap((res: HttpResponse<any>) => {
          this.setToken(res.body.token);
        }));
    }



   getUserConnectedRoles(){
     var decodedToken = jwt_decode(this.getToken());
      return  decodedToken['roles'];
    }


     // roles is undefined  result=false
    // roles  contains "ROLE_ADMIN  result = true
   // roles  does not contain "ROLE_ADMIN" result =false
    getConnectedAdmin(){
      if(this.loggedIn()){
        const roles = this.getUserConnectedRoles();
        return roles.includes('ROLE_ADMIN');
      }
      return false;
    }

    isSuperAdmin(){
      if(this.loggedIn()){
        const roles = this.getUserConnectedRoles();
        return roles.includes('ROLE_SUPER_ADMIN');
      }
      return false;

    }


}

