import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LevelcardsComponent } from './components/levelcards/levelcards.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

import { RouterModule } from '@angular/router';
import { AnswerQuestionComponent } from './components/answer-question/answer-question.component';


@NgModule({

  declarations: [LevelcardsComponent,
  HeaderComponent,
  FooterComponent,
  AnswerQuestionComponent],

  imports: [

    CommonModule,
    RouterModule
  ],
  exports: [
    LevelcardsComponent,
    HeaderComponent,
    FooterComponent,
    AnswerQuestionComponent
  ]
})
export class SharedModule { }
