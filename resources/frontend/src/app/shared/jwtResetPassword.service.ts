import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export class User {
  name: string;
  email: string;
  password: string;
  password_confirmation: string
}

@Injectable({
  providedIn: 'root'
})

export class JwtResetPassword {

  url_updatePassword = `${environment.base_url}/update-password`;
  url_resetPassword  = `${environment.base_url}/req-password-reset`;

  constructor(private http: HttpClient) { }

  // req-password-reset
  reqPasswordReset(data) {
    return this.http.post(this.url_resetPassword, data)
  }

  // update password
  updatePassword(data) {
    return this.http.post(this.url_updatePassword, data)
  }

}
