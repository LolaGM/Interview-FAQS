import { Component, inject } from '@angular/core';
import { Question } from 'src/app/shared/interfaces/answerQuestion.interface';
import { DataService } from '../../services/data.service';
import { PagesService } from '../../services/pages.service';
import { UsersService } from 'src/app/auth/services/users.service';
import { Subject, combineLatest} from 'rxjs';
import { switchMap, takeUntil } from 'rxjs';
import { UserService } from 'src/app/auth/services/user.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css'],
})
export class FavoritesComponent {
  
  private dataService = inject(DataService);
  private pagesService = inject(PagesService);
  private userService = inject(UserService);

  public questions: Question[] = [];
  public favoriteQuestions: Question[] = [];

  public answerVisibility: { [key: number]: boolean } = {};
  public borderRadiusState: { [key: number]: boolean } = {};
  public isLink: { [key: number]: boolean } = {};

  public category: string = 'Angular';
  public level: string | null = null;
  public isLoading: boolean = true;
  public isLoggedIn: boolean = false;

  private unsubscribe$ = new Subject<void>();

  ngOnInit(): void {
    this.loadCategory();
    this.loadFavoriteQuestions();
    this.checkLoginStatus();
    this.userService.getIdDocument().subscribe(val => console.log(val))
  }

  checkLoginStatus() {
    this.userService.getAuthenticatedUserSubject().subscribe((loggedIn) => {
      if(loggedIn){
        this.isLoggedIn = true;
      }
     
    });
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
          this.isLink[question.id] = question.answer.startsWith('https://');
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
    this.dataService.markQuestionAsFavorite(questionId);
  }

  unmarkAsFavorite(questionId: number) {
    this.dataService.unmarkQuestionAsFavorite(questionId);
  }

  loadFavoriteQuestions() {
    this.dataService
      .getFavoriteQuestions()
      .subscribe((favoriteQuestions: Question[]) => {
        console.log(favoriteQuestions)
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

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
