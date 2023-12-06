import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../service/question.service';

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
  progress: string = "0";
  isQuizCompleted : boolean = false;
  interval$: any;
  counter = 60;
  constructor(private questionService: QuestionService) { }
  

  ngOnInit(): void {
    this.quizType = localStorage.getItem("name")!;

    if(this.quizType=="partos"){
      this.getAllQuestions();
      this.title="Indicador 1"
      this.subtitle="% de pacientes obstétricas a las que se les confirmó el diagnóstico de hemorragia post parto en el TRIAGE de forma inmediata por la magnitud de la pérdida hemática y cuadro clínico."
    }
  }

  getAllQuestions() {
    this.questionService.getQuestionJson()
      .subscribe(res => {
        this.questionList = res.questions;
      })

      if(localStorage.getItem('currentQuestion')){
        this.currentQuestion = Number(localStorage.getItem("currentQuestion")!);
        this.progress=this.currentQuestion.toString()
        this.isInputText=false
        }
  }

  nextQuestion() {
    this.isCorrectAnswer=false
    this.isInputText=false
    setTimeout(() => {
      this.currentQuestion++;
      this.isInputText=this.questionList[this.currentQuestion]?.isInputText;
      localStorage.setItem("currentQuestion",this.currentQuestion.toString());
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
      this.getProgressPercent();
    } else {
      this.isCorrectAnswer=false
      setTimeout(() => {
        this.currentQuestion++;
        this.isInputText=this.questionList[this.currentQuestion]?.isInputText; 
        this.isMultiSelect=this.questionList[this.currentQuestion]?.isMultiSelect; 
        this.getProgressPercent();
      }, 1000);

    }
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
