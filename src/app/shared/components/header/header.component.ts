import { Component, ElementRef, OnDestroy, OnInit, Renderer2, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PagesService } from 'src/app/pages/services/pages.service';
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
  public userPhoto? = "https://robohash.org/set=set1&size=180x180"

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
    console.log("entra al getUserlogged")
    this.userService.getAuthenticatedUserSubject()
    .pipe(
      takeUntil(this.unsubscribe$)
    )
    .subscribe(resp => {
      if (resp) {
        this.userData = resp.name
        
        if (typeof resp.photoUrl === 'string' && resp.photoUrl.includes('https')) {
          this.userPhoto = resp.photoUrl;
       
        } else if (typeof resp.photoUrl === 'number') {
          this.userPhoto = `https://robohash.org/${resp.photoUrl}?set=set1&size=180x180`; 
        }
        
        this.userService.setAuthenticatedUserProfileSubject(this.userPhoto)
        this.isUserAuthenticated = true;
      } else {
        this.userData = "";
        this.isUserAuthenticated = false;
      }
    })
  }


  logout() {
    this.userService.logout();
    localStorage.clear();
    this.router.navigate(['/login']);
    this.userPhoto = "https://robohash.org/set=set1&size=180x180"
    this.isUserAuthenticated = false;
  }


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  };


}