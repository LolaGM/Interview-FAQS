import { Component, ElementRef, OnDestroy, OnInit, Renderer2, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PagesService } from 'src/app/pages/services/pages.service';
import { UsersService } from '../../../auth/services/users.service';
import { UserService } from 'src/app/auth/services/user.service';

@Component({
  selector: 'app-header',

  templateUrl: './header.component.html',

  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {

  private pagesService = inject(PagesService);
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);
  private router = inject(Router);
  private userService = inject(UserService)

  public isVisible: boolean = false;
  public isUserLoggedIn: boolean = false;
  public isUserAuthenticated: boolean = false;
  public userData!: string;
  public userPhoto!: number;

  private unsubscribe$ = new Subject<void>();


  ngOnInit(): void {
    this.renderer.listen('document', 'click', (event: Event) => {
      if (!this.el.nativeElement.contains(event.target)) {
        this.closeMenu();
        this.closeUserMenu();
      }
    });

    this.getUserLogged()
  };


  onShowMenu() {
    this.isVisible = !this.isVisible;
  }


  onClickUser() {
    this.isUserLoggedIn = !this.isUserLoggedIn;
  }


  chooseCategory(category: string) {
    this.pagesService.setCategory(category);
    this.closeMenu();
  }


  closeMenu() {
    this.isVisible = false;
  }


  closeUserMenu() {
    this.isUserLoggedIn = false;
  }


  getUserLogged() {
    // this.userService.isUserLogged().subscribe(resp => {
    //   console.log("inicio de app", resp)
    //   if (resp) {
    //     this.userService.getUserById(resp.uid).subscribe(resp => {
    //       this.userData = resp[0].name
    //       this.userPhoto = resp[0].id
    //       this.isUserAuthenticated = true;
    //     })
    //   } else {
    //     this.userData = "";
    //     this.isUserAuthenticated = false;
    //   }
    // })
  }


  logout() {
    this.userService.logout();
    localStorage.clear();
    this.router.navigate(['/login']);
    this.isUserAuthenticated = false;
  }


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  };


}