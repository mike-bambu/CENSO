import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, Subject, of } from 'rxjs';

import { User } from './models/user';
import { Clues } from './models/clues';
import { Distritos } from './models/distritos';
import { Servicios } from './models/servicios';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authChange = new Subject<boolean>();  
  constructor(private http: HttpClient, private router: Router) {   }

  getToken(): string {
    return localStorage.getItem('token');
  }

  getUserData(): User{
    //console.log('####################################################################################### GetUserData()');
    let user = new User();
    user = JSON.parse(localStorage.getItem('user'));
    return user;
  }

  getCluesData(): Clues{
    let clues = new Clues();
    clues = JSON.parse(localStorage.getItem('clues'));
    return clues;
  }

  getDistritosData(): Distritos{
    let distritos = new Distritos();
    distritos = JSON.parse(localStorage.getItem('distrito'));
    return distritos;
  }

  getServiciosData(): Servicios{
    let servicios = new Servicios();
    servicios = JSON.parse(localStorage.getItem('servicios'));
    return servicios;
  }

  updateUserData(userData){
    let user = new User();
    user = userData;
    localStorage.setItem('user', JSON.stringify(user));
    this.authChange.next(true);
  }

  isAuth(): boolean {
    return !!this.getToken();
  }
  
  logIn(username: string, password: string):Observable<any> {
    const url = `${environment.base_url}/signin`;
    return this.http.post<any>(url, { username, password}).pipe(
      map( (response) => {
        if(response.access_token){
          localStorage.setItem('token', response.access_token);

          const user = JSON.stringify(response.user_data);
          localStorage.setItem('user', user);

          const clue = JSON.stringify(response.clues);
          localStorage.setItem('clues', clue);

          const distrito = JSON.stringify(response.distrito);
          localStorage.setItem('distrito', distrito);

          const permissions = JSON.stringify(response.permissions);
          localStorage.setItem('permissions', permissions);

          const servicios = JSON.stringify(response.servicios);
          localStorage.setItem('servicios', servicios);

          this.authChange.next(true);
        }
        return response;
      }
    ));
  }

  refreshToken():Observable<any>{
    const url = `${environment.base_url}/refresh`;
    return this.http.post<any>(url, {}).pipe(
      map( (response) => {
        if(response.access_token){
          localStorage.setItem('token', response.access_token);
          this.authChange.next(true);
        }
        return response;
      }
    ));
  }

  signUp(payload) {
    const url = `${environment.base_url}/signup`;
    return this.http.post<any>(url,payload).pipe(
      map( (response) => {
        if(response.access_token){
          localStorage.setItem('token', response.access_token);
          
          const user = JSON.stringify(response);
          localStorage.setItem('user', user);

          const permissions = JSON.stringify(response.permissions);
          localStorage.setItem('permissions', permissions);
          
          this.authChange.next(true);
        }
        return response;
      }
    ));
  }

  forgotPassword(email: string):Observable<any> {
    const url = `${environment.base_url}/forgot-password`;
    return this.http.post<any>(url, { email });
  }

  resetPassword(email:string, password: string, token: string):Observable<any> {
    const url = `${environment.base_url}/reset-password`;
    return this.http.post<any>(url, {email, password, token}).pipe(
      map( (response) => {
        if(response.token){
          localStorage.setItem('token', response.token);
          this.authChange.next(true);
        }
        return response;
      }
    ));
  }

  logout() {
    //this.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('userApps');
    localStorage.removeItem('permissions');
    localStorage.removeItem('clues');
    localStorage.removeItem('servicios');
    localStorage.removeItem('distrito');
    localStorage.removeItem('measurementType');
    localStorage.removeItem('currentQuestion');
    localStorage.removeItem('totalIterations');
    localStorage.removeItem('headerID');
    this.authChange.next(false);
    this.router.navigate(['/login']);
  }
}
