import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { throwError } from 'rxjs';
import { Router, ActivatedRoute  } from '@angular/router';
import { JwtResetPassword } from '../../shared/jwtResetPassword.service';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})

export class UpdatePasswordComponent implements OnInit {

  updatePwd: UntypedFormGroup;
  errors = null;
  isLoading = false;
  confirmPasword = '';
  hidePassword = true;
  hidePasswordConfirm = true;

  constructor(
    public fb: UntypedFormBuilder,
    public activatedRoute: ActivatedRoute,
    public jwtResetPassword: JwtResetPassword,
    private sharedService: SharedService,
    public router: Router,
  ) {
    this.updatePwd = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      password_confirmation: ['', [Validators.required]],
      passwordToken: ['']
    })
    activatedRoute.queryParams.subscribe((params) => {
      this.updatePwd.controls['passwordToken'].setValue(params['token']);
    })
  }

  ngOnInit(): void { }

  updatePassword(){
    this.isLoading = true;
    this.jwtResetPassword.updatePassword(this.updatePwd.value).subscribe(
      result => {
        this.isLoading = false;
        this.sharedService.showSnackBar('¡La contraseña se actualizo Correctamente! del usuario con el Correo:'+' '+this.updatePwd.value.email, 'Cerrar', 4000);
        this.updatePwd.reset();
        this.router.navigate(['/login']);
        //console.log(this.updatePwd.value)
      },
      error => {
        this.isLoading = false;
        this.handleError(error);
      }
    );
  }

  handleError(error) {
      let errorMsg = '';
      if (error.error instanceof ErrorEvent) {
        errorMsg = `Error: ${error.error.message}`;
        //console.log("mensajeeee error", errorMsg);
        this.sharedService.showSnackBar('Error, verifique sus datos', 'Cerrar', 4000);
      } else {
          errorMsg = `Error Code: ${error.status}\nMessage: ${error.message}`;
          this.sharedService.showSnackBar('Error, verifique sus datos', 'Cerrar', 4000);
      }
      return throwError(errorMsg);
  }

}
