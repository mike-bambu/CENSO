import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { AuthService } from 'src/app/auth/auth.service';
import { Clues } from 'src/app/auth/models/clues';
import { User } from 'src/app/auth/models/user';
import { SharedService } from 'src/app/shared/shared.service';
import { QuestionService } from '../service/question.service';

export interface FormDialogData {
  id: number;
}
@Component({
  selector: 'app-details-dialog',
  templateUrl: './details-dialog.component.html',
  styleUrls: ['./details-dialog.component.css']
})
export class DetailsDialogComponent implements OnInit{
 
  @ViewChild('name') nameKey!: ElementRef;


  constructor(
    private authService: AuthService,
    public dialogRef: MatDialogRef<DetailsDialogComponent>,
    public dialog: MatDialog,
    private fb: UntypedFormBuilder,
    private snackBar: MatSnackBar,
    private sharedService: SharedService,
    public router: Router,
    private calidadService: QuestionService,

    @Inject(MAT_DIALOG_DATA) public data: FormDialogData
  ) {}

  showSnackBar(message, action, duration){
    this.snackBar.open(message, action,{
      duration: duration
    });
  }
  authUser: User;
  authClues: Clues;
  isLoading = false;
  minDate:Date;
  dateNow:any = '';
  fechaInicial:any = '';
  mesActual:any = '';
  maxDate:Date;
  quizPartosForm:UntypedFormGroup;
  headerMeasurement: any = {};

  ngOnInit(): void {
    this.quizPartosForm = this.fb.group ({
      initParto: this.fb.group({  
        type:[''],
        fecha_init_quiz:['', Validators.required],  
        month_measurement:['', Validators.required], 
        iterations_quiz:['', Validators.required], 
        clues_id:[''],
      })
    });
    moment.locale('es');
    const fecha = new Date();
    this.minDate = new Date(2023, 0, 1);
    this.maxDate = fecha;
    this.authUser = this.authService.getUserData();
    this.quizPartosForm.controls['initParto'].get('fecha_init_quiz').patchValue(this.maxDate);
    this.authClues = this.authService.getCluesData();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  startQuiz(){
    this.isLoading = true;
    this.quizPartosForm.controls['initParto'].get('type').patchValue('partos');
    this.quizPartosForm.controls['initParto'].get('clues_id').patchValue(this.authClues.id);
    const formData = JSON.parse(JSON.stringify(this.quizPartosForm.value));



    //params.month_measurement=formData.initParto.month_measurement
    //formData.date_start=formData.initParto.fecha_init_quiz;
    //formData.clues_id=this.authClues.id;
    //formData.total_files=formData.initParto.iterations_quiz;
    //formData.month_measurement=formData.initParto.month_measurement;
  

  this.calidadService.createMeasurement(formData).subscribe({
    next:(response) => {
      this.dialogRef.close(true);
      this.headerMeasurement = response.data;
      this.isLoading = false;
      localStorage.setItem("measurementType","partos");
      localStorage.setItem("totalIterations",formData.initParto.iterations_quiz);
      localStorage.setItem("currentQuestion",'0');
      localStorage.setItem("headerID",this.headerMeasurement['id']);
      localStorage.setItem("totalFiles",formData.initParto.iterations_quiz);
      this.router.navigate(['/calidad/partos-questions']);


    },
    error:(error: HttpErrorResponse) => {
  
      this.dialogRef.close(true);
      this.sharedService.showSnackBar('El mes a validar ya se encuentra registrado', 'Cerrar', 3000);
      console.log(error);
      this.isLoading = false;
    }
  });
  }

}
