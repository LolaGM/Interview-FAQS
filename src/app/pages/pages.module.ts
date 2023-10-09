
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePageComponent } from './home-page/home-page.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

import { AngularQuestionsComponentComponent } from './components/angular-questions-component/angular-questions-component.component';
import { ContentPageComponent } from './content-page/content-page.component';
import { CssQuestionsComponentComponent } from './components/css-questions-component/css-questions-component.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { GitQuestionsComponentComponent } from './components/git-questions-component/git-questions-component.component';
import { HtmlQuestionsComponentComponent } from './components/html-questions-component/html-questions-component.component';
import { JavascriptQuestionsComponentComponent } from './components/javascript-questions-component/javascript-questions-component.component';
import { MainCircleComponent } from './components/main-circle/main-circle.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { SoftskillsQuestionsComponentComponent } from './components/softskills-questions-component/softskills-questions-component.component';
import { TypescriptQuestionsComponentComponent } from './components/typescript-questions-component/typescript-questions-component.component';
import { UserDataComponent } from './components/user-data/user-data.component';
import { WeblinksComponent } from './weblinks-page/weblinks-page.component';
import { QuizComponent } from './quiz/quiz.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { NgModule } from '@angular/core';



@NgModule({
  declarations: [
    AngularQuestionsComponentComponent,
    ContentPageComponent,
    CssQuestionsComponentComponent,
    EditUserComponent,
    FavoritesComponent,
    GitQuestionsComponentComponent,
    HomePageComponent,
    HtmlQuestionsComponentComponent,
    JavascriptQuestionsComponentComponent,
    MainCircleComponent,
    ProfilePageComponent,
    SoftskillsQuestionsComponentComponent,
    TypescriptQuestionsComponentComponent,
    UserDataComponent,
   WeblinksComponent,
    QuizComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
  ],
  exports: [
    HomePageComponent,
    QuizComponent
  ]

})
export class PagesModule { }
