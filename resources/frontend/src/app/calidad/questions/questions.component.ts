import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../service/question.service';
import { log } from 'console';

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
  constructor(private questionService: QuestionService) { }
  

  ngOnInit(): void {
    this.quizType = localStorage.getItem("measurementType")!;
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
      })
  }

  nextQuestion() {
    this.isCorrectAnswer=false
    setTimeout(() => {
      this.currentQuestion++;
      this.isInputText=this.questionList[this.currentQuestion]?.isInputText;
      this.isMultiSelect=this.questionList[this.currentQuestion]?.isMultiSelect; 
      this.isCheckedType=this.questionList[this.currentQuestion]?.isCheckedType; 
      this.getProgressPercent();
    }, 800);
    
  }

  getProgressPercent() {
    this.progress = ((this.currentQuestion / this.questionList.length) * 100).toString();
    return this.progress;

  }

  answer(currentQno: number, option: any) {

    if(currentQno === this.questionList.length){
      this.isQuizCompleted = true;
      this.stopCounter();
    }
    if (option.correct) {
      this.isCorrectAnswer=true
      this.isInputText=this.questionList[this.currentQuestion]?.isInputText; 
      this.isMultiSelect=this.questionList[this.currentQuestion]?.isMultiSelect; 
      this.isCheckedType=this.questionList[this.currentQuestion]?.isCheckedType; 
      this.getProgressPercent();
    } else {
      this.isCorrectAnswer=false
      setTimeout(() => {
        this.currentQuestion++;
        this.isInputText=this.questionList[this.currentQuestion]?.isInputText; 
        this.isMultiSelect=this.questionList[this.currentQuestion]?.isMultiSelect; 
        this.isCheckedType=this.questionList[this.currentQuestion]?.isCheckedType; 
        this.getProgressPercent();
      }, 1000);

    }
    localStorage.setItem("currentQuestion",currentQno.toString());
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
    this.resetCounter();
    this.getAllQuestions();
    this.counter = 60;
    this.currentQuestion = 0;
    this.progress = "0";
  }

}
