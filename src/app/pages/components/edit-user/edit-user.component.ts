import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { UserData } from 'src/app/shared/interfaces/user-data.interface';

import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
})
export class EditUserComponent implements OnInit, OnDestroy {
  

  private route = inject(ActivatedRoute);
  private router = inject(Router);

  public user: UserData | null = null;

  private unsubscribe$ = new Subject<void>();


  ngOnInit(): void {
    // this.getUserIdByUrl();
  }


  // getUserIdByUrl(): void {
  //   const userId = this.route.snapshot.params['id'];
  //   console.log('ID del usuario:', userId);

  //   this.usersService.getUserById(userId)
  //     .pipe(
  //       takeUntil(this.unsubscribe$)
  //     )
  //     .subscribe((userData: UserData) => {
  //       this.user = userData;
  //     });
  // };


//   onSaveChanges() {
//     if (this.user) {
//       this.usersService.updateUser(this.user)
//       .pipe(
//         takeUntil(this.unsubscribe$)
//       )
//       .subscribe((updatedUser) => {
//         console.log('Usuario actualizado:', updatedUser);
//         this.user = updatedUser;
//         this.usersService.setAuthenticatedUserSubject(this.user)
//         this.router.navigate(['/profile-page/data']);
//       });
//   } else {
//     console.error('No se puede enviar el formulario porque "user" es nulo o indefinido.');
//   }
// };


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  };

  
  onCancelEdit(){
    this.router.navigate(['/profile-page/data']);
  }
}