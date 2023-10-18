import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';

import { UserData } from 'src/app/shared/interfaces/user-data.interface';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserService } from 'src/app/auth/services/user.service';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.css'],
})
export class UserDataComponent implements OnInit, OnDestroy {

  private userService = inject(UserService);

  public userPhoto?:any;

  public userData: UserData | null = null;

  private unsubscribe$ = new Subject<void>();


  ngOnInit(): void {
    this.getUserLogged();


  };


   getUserLogged() {
    this.userService.getAuthenticatedUserSubject()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((user) => {
        if (user) {
          if (Array.isArray(user)) {
            this.userData = user[0]
          } else {
            this.userData = user
          }
          this.getPhoto()
        }
      });
  };

  getPhoto(){
    this.userService.getAuthenticatedUserProfileSubject()
    .pipe(
      takeUntil(this.unsubscribe$)
    )
    .subscribe(resp => this.userPhoto = resp)
  }



  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  };
}
