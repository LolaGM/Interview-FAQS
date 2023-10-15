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
    // this.checkUserLogin();
     this.getUserLogged()
  
  };


  checkUserLogin() {
    const authDataString = localStorage.getItem('authToken');
    if (authDataString) {
      const authData = JSON.parse(authDataString);
      const userId = authData.userId;
      this.userService.getUserById(userId)
        .pipe(
          takeUntil(this.unsubscribe$)
        )
        .subscribe((user: any) => {
          this.userService.setAuthenticatedUserSubject(user);
        });
    };
  };


  toggleBlurEffect(blur: boolean) {
    this.isBlurred = blur;
  };


  getUserLogged() {
    const authDataString = localStorage.getItem('authToken');
    if(authDataString){
      this.userServices.getUserLogged()
      // this.userServices.isUserLogged().subscribe(resp => {
      //   console.log("inicio de app",resp)
        
      // })
    }
     
  }


  

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  };

}