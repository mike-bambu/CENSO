import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../service/question.service';
import { log } from 'console';
import { FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

  public quizType: string = "";
  subtitle=""
  title=""
  public questionList: any = [];
  public currentQuestion: number = 0;
  isCorrectAnswer: boolean=false
  isInputText: boolean=true
  isMultiSelect: boolean=false
  isCheckedType: boolean=false
  progress: string = "0";
  isQuizCompleted : boolean = false;
  interval$: any;
  counter = 60;
  totalFiles: number=0;
  totalIterations: number=0;
  quizAnswersForm:UntypedFormGroup;
  btnNext: boolean = false;
  public header_id: string = "";

  constructor(
    private questionService: QuestionService, 
    private fb: UntypedFormBuilder,
    private calidadService: QuestionService,
    public router: Router) { }
  


  ngOnInit(): void {
    this.quizAnswersForm = this.fb.group ({
      initAnswers: this.fb.group({  
        expedienteid:['', Validators.required],
        headerID:[''],
        question:[''],
        answers:[''],
        isMeasurable:[''],
        testPass:[''],
        checkboxControlName: ['']
      })
    });
    this.quizType = localStorage.getItem("measurementType")!;
    this.header_id = localStorage.getItem("headerID")!;
    if(this.quizType=="partos"){
      this.getAllQuestions();
      this.title="Ingreso a sala de labor cumpliendo los criterios establecidos en la norma"
      this.subtitle="Seleccione sólo una opción."
    }
  }

  getAllQuestions() {
    this.questionService.getQuestionJson()
      .subscribe(res => {
        this.questionList = res.questions;
        if(localStorage.getItem('currentQuestion')){
          this.currentQuestion = Number(localStorage.getItem("currentQuestion")!);
          this.progress=this.currentQuestion.toString()
          this.isInputText=this.questionList[this.currentQuestion]?.isInputText;
          this.isMultiSelect=this.questionList[this.currentQuestion]?.isMultiSelect; 
          this.isCheckedType=this.questionList[this.currentQuestion]?.isCheckedType; 
          this.getProgressPercent();
          console.log("valor de current: "+this.currentQuestion)
          console.log("valor de checked: "+this.isCheckedType)
          } 

          if(localStorage.getItem('totalIterations')){
            this.totalFiles = Number(localStorage.getItem("totalIterations")!);
            this.totalIterations= Number(localStorage.getItem("totalFiles")!);
            console.log("valor de totalfile: "+this.totalFiles);

            if(this.totalFiles===0){
              this.isQuizCompleted = true;
              this.stopCounter();
            }
          }
      })
  }

  nextQuestion(currentQno: number) {
    
    this.isCorrectAnswer=false
    this.quizAnswersForm.controls['initAnswers'].get('headerID').patchValue(this.header_id);
    this.quizAnswersForm.controls['initAnswers'].get('question').patchValue(this.questionList[currentQno]?.questionText);
    //this.quizAnswersForm.controls['initAnswers'].get('expedienteid').patchValue(localStorage.getItem("lastFile"));
    const formData = JSON.parse(JSON.stringify(this.quizAnswersForm.value));
    console.log('valor de expediente: '+formData.initAnswers.expedienteid);
    console.log('valor de pregunta: '+formData.initAnswers.question);
    console.log('valor de respuesta: '+this.questionList[currentQno-1]?.textId);
    console.log('valor de respuesta: '+this.questionList[currentQno-1]?.title);
    console.log('valor de fecha: '+this.quizAnswersForm.controls['initAnswers'].get('$dateValue'));
   
    if(this.currentQuestion===0){
      localStorage.setItem("lastFile",formData.initAnswers.expedienteid);
    }

    if(currentQno < this.questionList.length){
      setTimeout(() => {
        this.currentQuestion++;
        this.isInputText=this.questionList[this.currentQuestion]?.isInputText;
        this.isMultiSelect=this.questionList[this.currentQuestion]?.isMultiSelect; 
        this.isCheckedType=this.questionList[this.currentQuestion]?.isCheckedType; 
        localStorage.setItem("currentQuestion",currentQno.toString());
        this.title=this.questionList[this.currentQuestion].title
        this.getProgressPercent();
      }, 800);
    }
    
    if(currentQno >= this.questionList.length){
      this.totalFiles--;

      if(this.totalFiles===0){
        localStorage.setItem("totalIterations",this.totalFiles.toString());
        this.isQuizCompleted = true;
        this.stopCounter();
      }
      else{
        localStorage.setItem("currentQuestion",'0');
        localStorage.setItem("totalIterations",this.totalFiles.toString());
        this.resetQuiz();
      }    
    }
    
  }

  getProgressPercent() {
    this.progress = ((this.currentQuestion / this.questionList.length) * 100).toString();
    return this.progress;

  }

  answer(currentQno: number, option: any) {

    if(currentQno === this.questionList.length){
      this.totalFiles--;
      console.log("valor de totalfile: "+this.totalFiles);
      if(this.totalFiles===0){
        this.isQuizCompleted = true;
        this.stopCounter();
      }
      else{
        currentQno=0;
        localStorage.setItem("currentQuestion",currentQno.toString());
        this.resetQuiz();

      }    
    }
    if (option.correct) {
      this.isCorrectAnswer=true
      this.isInputText=this.questionList[this.currentQuestion]?.isInputText; 
      this.isMultiSelect=this.questionList[this.currentQuestion]?.isMultiSelect; 
      this.isCheckedType=this.questionList[this.currentQuestion]?.isCheckedType; 
      this.getProgressPercent();
    } else {
      this.isCorrectAnswer=false
      if(currentQno < this.questionList.length){
        setTimeout(() => {
          this.currentQuestion++;
          this.isInputText=this.questionList[this.currentQuestion]?.isInputText;
          this.isMultiSelect=this.questionList[this.currentQuestion]?.isMultiSelect; 
          this.isCheckedType=this.questionList[this.currentQuestion]?.isCheckedType; 
          localStorage.setItem("currentQuestion",currentQno.toString());
          this.title=this.questionList[this.currentQuestion].title
          this.getProgressPercent();
        }, 800);
      }
    }
    if(!this.questionList[this.currentQuestion]?.condicionant){
      localStorage.setItem("currentQuestion",currentQno.toString());

    }
    console.log("valor de currentxx: "+this.currentQuestion)
    
  }

  stopCounter() {
    this.interval$.unsubscribe();
    this.counter = 0;
  }

  resetCounter() {
    this.stopCounter();
    this.counter = 60;
  }

  resetQuiz() {
    //this.router.navigate(['/calidad/questions']);
    this.getAllQuestions();
    this.counter = 60;
    this.currentQuestion = 0;
    this.progress = "0";
  }

  checkValue(event: any) {

    if(event.target.value==='Ninguno de las anteriores'){
      console.log(event.target.value)
      this.quizAnswersForm.controls['initAnswers'].get('checkboxControlName').patchValue(!event.target.checked);
    }
    this.btnNext=true;
}

}
