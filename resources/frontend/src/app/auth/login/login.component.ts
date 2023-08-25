import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: UntypedFormGroup;
  isLoading = false;

  avatarPlaceholder = 'assets/profile-icon.svg';

  constructor(private router: Router, private sharedService: SharedService, private authService: AuthService) { }

  ngOnInit() {
    this.loginForm = new UntypedFormGroup({
      usuario: new UntypedFormControl('',{ validators: [Validators.required] }),
      password: new UntypedFormControl('', { validators: [Validators.required] })
    });
  }

  onSubmit(){
    this.isLoading = true;
    this.authService.logIn(this.loginForm.value.usuario, this.loginForm.value.password ).subscribe(
      response => {
        //this.isLoading = false;
        let loginHistory:any = {};
        if(localStorage.getItem('loginHistory')){
          loginHistory = JSON.parse(localStorage.getItem('loginHistory'));
        }
        loginHistory[response.user_data.username] = response.user_data.avatar;
        localStorage.setItem('loginHistory',JSON.stringify(loginHistory));

        this.router.navigate(['/apps']);
      }, error => {
        console.log(error);
        let errorMessage = "Error: Credenciales inválidas.";
        if(error.status != 401){
          errorMessage = "Ocurrió un error.";
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
        this.isLoading = false;
      }
    );
  }

  checkAvatar(username){
    this.avatarPlaceholder = 'assets/profile-icon.svg';

    if(localStorage.getItem('loginHistory')){
      const loginHistory = JSON.parse(localStorage.getItem('loginHistory'));
      
      if(loginHistory[username]){
        this.avatarPlaceholder = loginHistory[username];
      }
    }
  }

}
