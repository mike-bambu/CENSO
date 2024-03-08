import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../service/question.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Console } from 'console';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { DetailsDialogComponent } from '../details-dialog/details-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { delay } from 'rxjs';
import { Clues } from 'src/app/auth/models/clues';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from '../../auth/models/user';

@Component({
  selector: 'app-partos-questions',
  templateUrl: './partos-questions.component.html',
  styleUrls: ['./partos-questions.component.css']
})
export class PartosQuestionsComponent implements OnInit{
  public quizType: string = "";
  public headerId: string = "";
  isQuizCompleted : boolean = false;
  public currentQuestion: number = 0;
  totalFiles: number=0;
  totalIterations: number=0;
  progress: string = "0";
  quizAnswersForm:UntypedFormGroup;
  dilatacionType: boolean = false;
  borramientoType: boolean = false;
  anticonceptivoType: boolean = false;
  isLoading = false;
  maxDate:Date;
  mediaSize: string;
  authClues: Clues;
  authUser: User;
  mesrevision: string="";
  resultado1:string="";
  resultado2:string="";
  resultado3:string="";
  resultado4:string="";
  resultado5:string="";
  resultado6:string="";
  resultado7:string="";
  resultado8:string="";
  resultado9:string="";
  resultado10:string="";
  resultado11:string="";
  resultado12:string="";
  constructor(
    private questionService: QuestionService, 
    private fb: UntypedFormBuilder,
    private calidadService: QuestionService,
    public dialog: MatDialog,
    private authService: AuthService,
    public router: Router) { }
  
  ngOnInit(): void {
    this.isLoading=true
    this.quizAnswersForm = this.fb.group ({
      initAnswers: this.fb.group({  
        expedienteid:['', Validators.required],
        fechaparto:['', Validators.required],
        tienedilatacion:['',Validators.required],
        dilatacioncentimetros:[''],
        tieneborramiento:['',Validators.required],
        borramientoporcentaje:[''],
        laborcontracciones:['',Validators.required],
        monitoreopartograma: [''],
        registrograficono: [''],
        graficofrecuenciafetal: [''],
        graficodescensofetal: [''],
        detectoalteracion: [''],
        desicionobstetricahallazgo: [''],
        checkboxControlName: [''],
        administrooxitocina: [''],
        pinzamientocordonumbilical: [''],
        cuidadoscordonumbilical: [''],
        valoracionapgarminuto: [''],
        valoracionapgarcincominutos: [''],
        valoracionsilverman: [''],
        vitaminak: [''],
        antibioticolocalojos: [''],
        examenfisicocompleto: [''],
        checkboxAntropometricas: [''],
        valoracionedadgestacional: [''],
        valoracionmadurezfisica: [''],
        cie10: [''],
        criterios15: [''],
        tipoanticonceptivo: [''],
        firmaconsentimiento: [''],
        criterios24: [''],
      })
    });

    moment.locale('es');
    const fecha = new Date();
    this.maxDate = fecha;
    
    this.quizAnswersForm.controls['initAnswers'].get('fechaparto').patchValue(this.maxDate);
    
    this.quizType = localStorage.getItem("measurementType")!;
    this.headerId = localStorage.getItem("headerID")!;
    this.authClues = this.authService.getCluesData();
    this.authUser= this.authService.getUserData();
      if(localStorage.getItem('totalIterations')){
        this.totalFiles = Number(localStorage.getItem("totalFiles")!);
        this.totalIterations= Number(localStorage.getItem("totalIterations")!);
        this.mesrevision=localStorage.getItem("reviewMonth");
        this.progress=this.totalIterations.toString()
        if(this.totalFiles===0){
          this.isQuizCompleted = true;
        }
      } 
      else{
        this.isQuizCompleted = true;
      }
      this.resultado1=this.randomWord();
      this.resultado2=this.randomWord();
      this.resultado3=this.randomWord();
      this.resultado4=this.randomWord();
      this.resultado5=this.randomWord();
      this.resultado6=this.randomWord();
      this.resultado7=this.randomWord();
      this.resultado8=this.randomWord();
      this.resultado9=this.randomWord();
      this.resultado10=this.randomWord();
      this.resultado11=this.randomWord();
      this.resultado12=this.randomWord();
      this.getProgressPercent();
    this.isLoading=false;
  }

  onChange(e) {
    
    switch(e.target.value){
      case ("dilatacionSi"):
        this.dilatacionType=true
        this.quizAnswersForm.controls['initAnswers'].get('dilatacioncentimetros').setValidators(Validators.required);
      break;

      case ("dilatacionNo"):
        this.dilatacionType=false
        this.quizAnswersForm.controls['initAnswers'].get('dilatacioncentimetros').patchValue("");
        this.quizAnswersForm.controls['initAnswers'].get('dilatacioncentimetros').setValidators(null);
      break;

      case ("borramientoSi"):
        this.borramientoType=true
        this.quizAnswersForm.controls['initAnswers'].get('borramientoporcentaje').setValidators(Validators.required);
      
      break;

      case ("borramientoNo"):
        this.borramientoType=false
        this.quizAnswersForm.controls['initAnswers'].get('borramientoporcentaje').patchValue("");
        this.quizAnswersForm.controls['initAnswers'].get('borramientoporcentaje').setValidators(null);      
      break;

      case ("anticonceptivoSi"):
        this.anticonceptivoType=true
      break;

      case ("anticonceptivoNo"):
        this.anticonceptivoType=false
        break;

    }     
    console.log("valor de radio: "+e.target.value);
 }

 checkValue(event: any) {
  if(event.target.value==='Ninguno de las anteriores'){
    console.log(event.target.value)
    this.quizAnswersForm.controls['initAnswers'].get('checkboxControlName').patchValue(!event.target.checked);
  }
}

checkValueAntropometricas(event: any) {
  if(event.target.value==='Ninguno de las anteriores'){
    console.log(event.target.value)
    this.quizAnswersForm.controls['initAnswers'].get('checkboxAntropometricas').patchValue(!event.target.checked);
  }
}

checkValueCriterios15(event: any) {
  if(event.target.value==='Ninguno de las anteriores'){
    console.log(event.target.value)
    this.quizAnswersForm.controls['initAnswers'].get('criterios15').patchValue(!event.target.checked);
  }
}

checkValueCriterios24(event: any) {
  if(event.target.value==='Ninguno de las anteriores'){
    console.log(event.target.value)
    this.quizAnswersForm.controls['initAnswers'].get('criterios24').patchValue(!event.target.checked);
  }
}

showDialog(){

  let configDialog = {};
  if(this.mediaSize == 'xs'){
    configDialog = {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      data:{ scSize:this.mediaSize}
    };
  }else{
    configDialog = {
      width: '99%',
      maxHeight: '90vh',
      height: '200px',
      data:{}
    }
  }


  const dialogRef = this.dialog.open(ConfirmDialogComponent, configDialog);

  dialogRef.afterClosed().subscribe(valid => {
    if(valid){
      this.isLoading=true;
      setTimeout(() => {
        this.isLoading=false;
        this.validateQuiz();
     }, 5000);
    }else{
      console.log('Cancelar');
    }
  });
}

validateQuiz(){

  if(localStorage.getItem('totalIterations')){
  
    if(this.totalIterations===this.totalFiles){
      this.isQuizCompleted = true;
      this.resultado1=this.randomWord();
    }
    else{
      this.totalIterations++
      localStorage.setItem("totalIterations",this.totalIterations.toString());
      this.getProgressPercent();
      window.location.reload();
    }
  }

}

randomWord(){
  var theWord= [
    'Aprobado',
    'No aprobado',
  ]
  var wordNum = Math.floor(Math.random() * theWord.length);
  return theWord[wordNum];

}

redirect(){
  this.router.navigate(['/calidad/vista-partos']);
}

getProgressPercent() {
  this.progress = ((this.totalIterations * 100 ) / this.totalFiles).toString();
  return this.progress;

}

}
