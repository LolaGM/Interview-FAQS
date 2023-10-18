import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';

import { UsersService } from 'src/app/auth/services/users.service';
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

  private usersService = inject(UsersService);
  private userService = inject(UserService);
  private router = inject(Router);
  public userPhoto?:any;

  public userData: UserData | null = null;

  private unsubscribe$ = new Subject<void>();


  ngOnInit(): void {
    this.getUserLogged();
    // this.getUpdatedUser();
    this.loadUserData();
  };


   getUserLogged() {
    this.userService.getAuthenticatedUserSubject()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((user) => {
        if (user) {
          console.log(user)
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



  loadUserData() {
    this.usersService.getAuthenticatedUserSubject()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((user) => {
        if (user) {
        this.userData = user
        if (typeof user.photoUrl === 'string' && user.photoUrl.includes('https')) {
          this.userPhoto = user.photoUrl;
        } else if (typeof user.photoUrl === 'number') {
          this.userPhoto = `https://robohash.org/${user.photoUrl}?set=set1&size=180x180`;
        }
        
      } 
      });
  };


  // getUpdatedUser(): void {
  //   this.usersService.getUpdatedUserSubject()
  //     .pipe(
  //       takeUntil(this.unsubscribe$)
  //     )
  //     .subscribe((updatedUser) => {
  //       console.log('Usuario actualizado:', updatedUser);

  //       if (updatedUser) {
  //         this.userData = updatedUser;
  //       }
  //     });
  // };


  // onConfirmDelete() {
  //   if (this.userData) {
  //     const confirmation = confirm(`¿Estás seguro de que deseas eliminar tu perfil ${this.userData.name}? Esta acción no se puede deshacer.`);

  //     if (confirmation) {
  //       localStorage.removeItem('authToken');
  //       // this.onDeleteUser(this.userData);
  //     }
  //     else {
  //       this.router.navigate(['/profile-page/data']);
  //     }
  //   }
  // };


  // onDeleteUser(userData: UserData) {
  //   this.usersService.deleteUserById(userData.id)
  //     .pipe(
  //       takeUntil(this.unsubscribe$)
  //     )
  //     .subscribe((_) => {
  //       this.router.navigate(['/login']);
  //     });
  // };


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  };
}