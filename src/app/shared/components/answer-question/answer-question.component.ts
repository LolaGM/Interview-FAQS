import { Component, inject } from '@angular/core';
import { Question } from '../../interfaces/answerQuestion.interface';
import { PagesService } from 'src/app/pages/services/pages.service';
import { Subject, combineLatest, of, switchMap, takeUntil } from 'rxjs';
import { DataService } from 'src/app/pages/services/data.service';

import { Router } from '@angular/router';
import { UserService } from 'src/app/auth/services/user.service';


@Component({
  selector: 'shared-answer-question',
  templateUrl: './answer-question.component.html',
  styleUrls: ['./answer-question.component.css'],
})
export class AnswerQuestionComponent {
  private pagesService = inject(PagesService);
  private dataService = inject(DataService);

  private userServices = inject(UserService);
  private router = inject(Router);

  public questions: Question[] = [];
  public favoriteQuestions: Question[] = [];
  public answerVisibility: { [key: number]: boolean } = {};
  public borderRadiusState: { [key: number]: boolean } = {};

  public category: string = 'Angular';
  public level: string | null = null;
  public isLoading: boolean = true;
  public isLoggedIn: boolean = false;
  private unsubscribe$ = new Subject<void>();


  ngOnInit(): void {
    this.loadCategory();
    this.loadFavoriteQuestions();
    this.checkLoginStatus()
  }

  playQuiz() {
    this.router.navigate(['/quiz']);
  }

  checkLoginStatus() {
    this.userServices.getAuthenticatedUserSubject()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((loggedIn) => {
        if (loggedIn) {
          this.isLoggedIn = true;
        } else {
          this.isLoggedIn = false;
        }

      })
  }

  getFaqs() {
    this.pagesService.selectedCategory$
      .pipe(
        switchMap((selectedCategory) => {
          return this.dataService.getQuestions(selectedCategory, this.level!);
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((questions: Question[]) => {
        this.questions = questions.map((question) => ({
          ...question,
          favorite: false,
        }));

        this.questions = questions;
        this.isLoading = false;
        this.questions.forEach((question) => {
          this.answerVisibility[question.id] = false;
          this.borderRadiusState[question.id] = false;
        });
      });
  }

  loadCategory() {
    combineLatest([
      this.pagesService.selectedCategory$,
      this.pagesService.selectedLevel$,
    ])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(([categoryFromService, levelFromService]) => {
        this.category = categoryFromService;
        this.level = levelFromService;
        this.getFaqs();
      });
  }

  favoriteStatus(questionId: number) {
    if (!this.isLoggedIn) {
      return;
    }

    const isFavorited = this.isFavorite(questionId);
    if (isFavorited) {
      this.unmarkAsFavorite(questionId);
      this.removeFromLocalFavorites(questionId);
    } else {
      this.markAsFavorite(questionId);
      this.addToLocalFavorites(questionId);
    }
  }


  addToLocalFavorites(questionId: number) {
    const questionToAdd = this.questions.find(
      (question) => question.id === questionId
    );

    if (questionToAdd) {
      this.favoriteQuestions.push(questionToAdd);
    }
  }

  removeFromLocalFavorites(questionId: number) {
    this.favoriteQuestions = this.favoriteQuestions.filter(
      (question) => question.id !== questionId
    );
  }

  markAsFavorite(questionId: number) {
    this.dataService.markQuestionAsFavorite(questionId)
  }

  unmarkAsFavorite(questionId: number) {
    this.dataService.unmarkQuestionAsFavorite(questionId);
  }

  loadFavoriteQuestions() {
    this.dataService
      .getFavoriteQuestions()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((favoriteQuestions: Question[]) => {
        this.favoriteQuestions = favoriteQuestions;
      });
  }

  isFavorite(questionId: number): boolean {
    return this.favoriteQuestions.some(
      (question) => question.id === questionId
    );
  }

  showAnswer(id: number) {
    this.answerVisibility[id] = !this.answerVisibility[id];
    this.borderRadiusState[id] = this.answerVisibility[id];
  }

  getCategoryImage(category: string): string {
    let imgUrl: string = '';

    switch (category) {
      case 'Angular':
        imgUrl = '../../../../assets/images/angular.png';
        break;
      case 'Html':
        imgUrl = '../../../../assets/images/html.png';
        break;
      case 'Css':
        imgUrl = '../../../../assets/images/css.png';
        break;
      case 'Javascript':
        imgUrl = '../../../../assets/images/javascript.png';
        break;
      case 'Typescript':
        imgUrl = '../../../../assets/images/typescript.png';
        break;
      case 'Softskills':
        imgUrl = '../../../../assets/images/softskills-icon.png';
        break;
      case 'Git':
        imgUrl = '../../../../assets/images/git-icon.png';
        break;
    }
    return imgUrl;
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
