import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface PasswordDialogData {
  password: string;
}

@Component({
  selector: 'confirm-password-dialog',
  templateUrl: './confirm-password-dialog.component.html',
  styleUrls: ['./confirm-password-dialog.component.css']
})
export class ConfirmPasswordDialogComponent implements OnInit{

  constructor(
    public dialogRef: MatDialogRef<ConfirmPasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PasswordDialogData
  ) {}

  confirmPasword = '';
  recievedPassword:string;
  hidePassword = true;
  
  ngOnInit(){
    this.recievedPassword = this.data.password;
  }



  onNoClick(): void {
    this.dialogRef.close();
  }

}