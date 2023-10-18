import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UsersService } from './auth/services/users.service';
import { UserService } from './auth/services/user.service';
import { UserData } from './shared/interfaces/user-data.interface';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'interview-faqs';

  public isBlurred: boolean = false;
  private userService = inject(UsersService);
  private unsubscribe$ = new Subject<void>();
  private userServices = inject(UserService);
  private user?: null | string = null
  private userData!: UserData |null;
  private auth = inject(Auth)

  ngOnInit(): void {
    this.getUserLogged()
  };



  toggleBlurEffect(blur: boolean) {
    this.isBlurred = blur;
  };



  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  };


  getUserLogged() {
    this.auth.onAuthStateChanged(user => {
      this.userServices.getUserById(user?.uid)
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(user => {
        const userData = user[0]
        this.userServices.setAuthenticatedUserSubject(userData)
      })
      console.log("este es mi user desde servicio",user)
    });
  }

}