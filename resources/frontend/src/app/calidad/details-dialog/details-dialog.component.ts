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
  fechaActual:any = '';
  fechaInicial:any = '';
  maxDate:Date;
  quizPartosForm:UntypedFormGroup;


  ngOnInit(): void {
    this.quizPartosForm = this.fb.group ({
      initParto: this.fb.group({  
        fecha_init_quiz:['', Validators.required],  
        iterations_quiz:['', Validators.required],  
      })

    });
    moment.locale('es');
    const fecha = new Date();
    this.fechaActual = moment(fecha).format('YYYY-MM-D');
    this.minDate = new Date(2023, 0, 1);
    this.maxDate = fecha;
    this.authUser = this.authService.getUserData();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  startQuiz(){
    this.dialogRef.close();
    localStorage.setItem("name","partos");
  }
}
