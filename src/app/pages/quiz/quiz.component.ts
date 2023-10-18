import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { QuestionWithAnswer } from 'src/app/shared/interfaces/answerQuestion.interface';
import { PagesService } from '../services/pages.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit, OnDestroy {


  public questions: QuestionWithAnswer[] = [];
  public selectedAnswer: string | null = null;
  public result: number = 0;
  public isSubmitted: boolean = false;

  private router = inject(Router);
  private dataService = inject(DataService);
  private pagesService = inject(PagesService);

  private unsubscribe$ = new Subject<void>();

  ngOnInit(): void {
    this.loadCategoryRandomQuestions();
  }

  loadCategoryRandomQuestions() {
    this.pagesService.selectedCategory$
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((selectedCategory) => {
        this.getRandomQuestions(selectedCategory)
      })
  }

  getRandomQuestions(selectedCategory: string) {
    this.dataService.getRandomQuestions(selectedCategory, 10).subscribe((questions) => {
      this.questions = questions.map((question) => ({ ...question, selectedAnswer: null }));
    });
  }


  goBack() {
    this.router.navigate(['/content-page']);
  }

  isCorrect(question: QuestionWithAnswer): boolean {
    return this.isSubmitted && question.selectedAnswer === question.correctAnswer;
  }

  areAllQuestionsAnswered(): boolean {
    return this.questions.every((question) => question.selectedAnswer !== null);
  }

  calculateResult(): number {
    let correctAnswers = 0;
    for (const question of this.questions) {
      if (question.selectedAnswer === question.correctAnswer) {
        correctAnswers++;
      }
    }
    return correctAnswers;
  }

  onSubmit() {
    this.isSubmitted = true;
    this.result = this.calculateResult();
  }


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}


