import { Component, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from '../../services/validators/validators.service';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';
import { PagesService } from '../../../pages/services/pages.service';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent implements OnDestroy {

  private fb = inject(FormBuilder);
  private validatorsService = inject(ValidatorsService);
  private router = inject(Router);
  private pagesService = inject(PagesService);
  private userService = inject(UserService);
  private unsubscribe$ = new Subject<void>();

  public isUserRegistered: boolean = true;

  public myForm: FormGroup = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    email: [
      '',
      [
        Validators.required,
        Validators.pattern(this.validatorsService.emailPattern),
      ],
    ],
  });


  get isEmailValid(): boolean {
    return this.myForm.get('email')?.valid as boolean;
  }


  isFieldValid(field: string): boolean | null {
    return this.validatorsService.isValidField(this.myForm, field);
  }


  chooseCategory(category: string): void {
    this.pagesService.setCategory(category);
  }


  async onLogin(): Promise<any> {
    try {
      const response = await this.userService.login(this.myForm.value.email, this.myForm.value.password);
      if (response) {

        this.userService.getUserById(response.user.uid)
          .pipe(
            takeUntil(this.unsubscribe$)
          )
          .subscribe(user => {
            const userData = user[0]
            this.userService.setAuthenticatedUserSubject(userData)
            this.router.navigate(['/']);
            const authData = {
              id: response.user.uid
            }
            localStorage.setItem('authToken', JSON.stringify(authData))
          })

      } else {
        this.isUserRegistered = false;
      }
    } catch (error) {
      console.log(error);
    }
  }


  onClick() {
    this.userService.loginWithGoogle()
      .then(async response => {
        console.log(response);
        if (response) {

          this.userService.getUserById(response.user.uid)
            .pipe(
              takeUntil(this.unsubscribe$)
            )
            .subscribe(async existingUser => {

              if (existingUser.length === 0) {
                const arrayName: any = response.user.displayName?.split(" ")
                const name = arrayName[0]
                const photoUrl = response.user.photoURL
                const user = {
                  id: response.user.uid,
                  name: name,
                  email: response.user.email,
                  password: null,
                  favoriteQuestions: [],
                  photoUrl: photoUrl ? photoUrl : 'default_url'
                };

                await this.userService.addUser(user);
                this.userService.setAuthenticatedUserSubject(user)
                console.log("user añadido",user)
                this.router.navigate(['/']);

              } else {
                const user = existingUser[0]
                await this.userService.setAuthenticatedUserSubject(user)
                console.log("user pasado",user)
                this.router.navigate(['/']);
              }
            });
        };
      })
      .catch(error => console.log(error))
  }


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
