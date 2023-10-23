import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, Validators, FormGroup } from '@angular/forms';

import { Router, ActivatedRoute  } from '@angular/router';

export interface ReingresoDialogData {
  dialogTitle?: string;
  dialogMessage?: string;
  btnColor?: string;
  btnText?: string;
  campo?:object;
}

@Component({
  selector: 'confirm-action-dialog',
  templateUrl: './confirm-action-dialog.component.html',
  styleUrls: ['./confirm-action-dialog.component.css']
})
export class ConfirmActionDialogComponent implements OnInit{

  constructor(
    public dialogRef: MatDialogRef<ConfirmActionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ReingresoDialogData,
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    public router: Router,
  ) {}

  title = 'Confirmar Acción';
  color = 'primary';
  btnText = 'Continuar';

  message:string;

  confirmValue:string;
  checkValue:boolean;
  value:object;

  
  ngOnInit(){

    console.log("los datos",this.data);
    
    if( this.value ){
      this.checkValue = true;
    }else{
      this.checkValue = false;
    }
    this.value = this.data.campo || undefined;
    this.title = this.data.dialogTitle || undefined;
    this.message = this.data.dialogMessage || undefined;
    this.btnText = this.data.btnText || undefined;

    console.log("los datos", this.value );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirm():void {
    if(this.checkValue === true){
      this.dialogRef.close(true);
    }
  }

  searchCurpPaciente(){

   //let data = this.value;

   const data =  JSON.parse(JSON.stringify(this.value));


   if( data['curp'] ){
    
    this.router.navigate(['/ingresos', JSON.parse(JSON.stringify(this.value))]);

   }else if( data['numero_expediente'] ){

    this.router.navigate(['/atencion-pacientes', JSON.parse(JSON.stringify(this.value))])
   }

    //this.router.navigate(['/ingresos/'], this.campo );
    //this.router.navigate(['/ingresos', { data }])
    
  }

}