import { Component, Inject, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ServiciosService } from '../servicios.service';
import { AuthService } from '../../auth/auth.service';
import { Clues } from '../../auth/models/clues';
import { CustomValidator } from '../../utils/classes/custom-validator';

export interface FormDialogData {
  id: number;
}

@Component({
  selector: 'form-servicio',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormServiciosComponent implements OnInit {

  constructor(
    private servicioService: ServiciosService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<FormServiciosComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: FormDialogData
  ) {}

  isLoading = false;
  servicios:any = {};

  authClues: Clues;

  provideID = false;
  
  servicioForm = this.fb.group({

    'nombre'        : ['',[Validators.required]],
    'es_ambulatorio': ['',[Validators.required]],
    'clues_id'      : ['',[Validators.required]],
    
  });

  ngOnInit() {

    this.authClues = this.authService.getCluesData();

    this.servicioForm.get('clues_id').patchValue(this.authClues.id);

    console.log(this.authClues.id);

    const id = this.data.id;
    if(id){
      this.isLoading = true;
      this.servicioService.getServicio(id).subscribe(
        response => {
          this.servicios = response.servicio;
          this.servicioForm.patchValue(this.servicios);
          this.isLoading = false;
        },
        errorResponse => {
          console.log(errorResponse);
          this.isLoading = false;
        });
    }
  }

  saveServicio(){
    this.isLoading = true;
    if(this.servicios.id){
      this.servicioService.updateServicio(this.servicios.id,this.servicioForm.value).subscribe({
        next:(response) => {
          this.dialogRef.close(true);
          this.isLoading = false;
        },
        error:(errorResponse: HttpErrorResponse) => {
          console.log(errorResponse);
          this.isLoading = false;
        },
        complete:() =>{}
      });

    }else{
      this.servicioService.createServicio(this.servicioForm.value).subscribe({
        next:(response) => {
          this.dialogRef.close(true);
          console.log(response);
          this.isLoading = false;
        },
        error:(errorResponse: HttpErrorResponse) => {
          console.log(errorResponse);
          this.isLoading = false;
        },
        complete:() =>{}
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }



}