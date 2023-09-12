import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginPageComponent } from './components/login/login-page.component';
import { ContentPageComponent } from './content-page/content-page.component';
import { HtmlQuestionsComponentComponent } from './components/html-questions-component/html-questions-component.component';
import { CssQuestionsComponentComponent } from './components/css-questions-component/css-questions-component.component';
import { JavascriptQuestionsComponentComponent } from './components/javascript-questions-component/javascript-questions-component.component';
import { AngularQuestionsComponentComponent } from './components/angular-questions-component/angular-questions-component.component';
import { MainCircleComponent } from './components/main-circle/main-circle.component';
import { RouterModule } from '@angular/router';
import { TypescriptQuestionsComponentComponent } from './components/typescript-questions-component/typescript-questions-component.component';
import { SharedModule } from '../shared/shared.module';
import { SoftskillsQuestionsComponentComponent } from './components/softskills-questions-component/softskills-questions-component.component';
import { WebpacksQuestionsComponentComponent } from './components/webpacks-questions-component/webpacks-questions-component.component';
import { WebmetricsQuestionsComponentComponent } from './components/webmetrics-questions-component/webmetrics-questions-component.component';
import { RegisterComponent } from './components/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    HomePageComponent,
    LoginPageComponent,
    ContentPageComponent,
    HtmlQuestionsComponentComponent,
    CssQuestionsComponentComponent,
    JavascriptQuestionsComponentComponent,
    AngularQuestionsComponentComponent,
    MainCircleComponent,
    TypescriptQuestionsComponentComponent,
    SoftskillsQuestionsComponentComponent,
    WebpacksQuestionsComponentComponent,
    WebmetricsQuestionsComponentComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    ReactiveFormsModule
  ],
  exports: [
    HomePageComponent,
    LoginPageComponent,
    RegisterComponent
  ]

})
export class PagesModule { }
