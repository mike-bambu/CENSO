import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../service/question.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Console } from 'console';
import * as moment from 'moment';

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
  constructor(
    private questionService: QuestionService, 
    private fb: UntypedFormBuilder,
    private calidadService: QuestionService,
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

    if(localStorage.getItem('currentQuestion')){
      this.currentQuestion = Number(localStorage.getItem("currentQuestion")!);
      }

      if(localStorage.getItem('totalIterations')){
        this.totalFiles = Number(localStorage.getItem("totalIterations")!);
        this.totalIterations= Number(localStorage.getItem("totalFiles")!);
        console.log("valor de totalfile: "+this.totalFiles);

        if(this.totalFiles===0){
          this.isQuizCompleted = true;
        }
      } 
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

}
