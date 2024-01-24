import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/models/user';
import { SharedService } from 'src/app/shared/shared.service';
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
    private route: ActivatedRoute,
    public router: Router,
    private http : HttpClient,

    @Inject(MAT_DIALOG_DATA) public data: FormDialogData
  ) {}

  showSnackBar(message, action, duration){
    this.snackBar.open(message, action,{
      duration: duration
    });
  }
  authUser: User;
  isLoading = false;
  minDate:Date;
  dateNow:any = '';
  fechaInicial:any = '';
  mesActual:any = '';
  maxDate:Date;
  quizPartosForm:UntypedFormGroup;


  ngOnInit(): void {
    this.quizPartosForm = this.fb.group ({
      initParto: this.fb.group({  
        fecha_init_quiz:['', Validators.required],  
        month_measurement:['', Validators.required], 
        iterations_quiz:['', Validators.required],  
      })

    });
    moment.locale('es');
    const fecha = new Date();
    this.dateNow = moment(fecha).format('YYYY-MM-D');
    this.mesActual = moment(fecha).format('MMMM');
    this.minDate = new Date(2023, 0, 1);
    this.maxDate = fecha;
    this.authUser = this.authService.getUserData();
    this.quizPartosForm.controls['initParto'].get('fecha_init_quiz').patchValue(this.maxDate);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  startQuiz(){
    this.isLoading = true;
    const formData = JSON.parse(JSON.stringify(this.quizPartosForm.value));
    console.log('valor de mes: '+formData.initParto.fecha_init_quiz)
    this.dialogRef.close();
    localStorage.setItem("measurementType","partos");
    localStorage.setItem("totalIterations",formData.initParto.iterations_quiz);
  }
}
