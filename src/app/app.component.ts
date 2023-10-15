import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UsersService } from './auth/services/users.service';
import { UserService } from './auth/services/user.service';
import { UserData } from './shared/interfaces/user-data.interface';

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
  private user?: null |string = null

  ngOnInit(): void {
     this.getUserLogged()
  };



  toggleBlurEffect(blur: boolean) {
    this.isBlurred = blur;
  };


  getUserLogged() {
    const authDataString = localStorage.getItem('authToken');
    if(authDataString){
      this.userServices.getUserById(authDataString).subscribe(user=>{
        console.log(user)
        const userData = user[0]
        console.log(userData)
        this.userServices.setAuthenticatedUserSubject(userData)
      })
    }
  }


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  };

}