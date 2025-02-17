import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { PagesService } from '../services/pages.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-content-page',
  templateUrl: './content-page.component.html',
  styleUrls: ['./content-page.component.css']
})
export class ContentPageComponent implements OnInit, OnDestroy {

  private pagesService = inject(PagesService);
  public selectedCategory: string = "Angular";
  private unsubscribe$ = new Subject<void>();


  ngOnInit(): void {
    this.getStoredCategory();
    this.loadCategory();
  };


  getStoredCategory() {
    const storedCategory = localStorage.getItem('selectedCategory');
    if (storedCategory) {
      this.selectedCategory = storedCategory;
    }
  };


  loadCategory() {
    this.pagesService.setCategory(this.selectedCategory);
    this.pagesService.selectedCategory$
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(content =>
        this.selectedCategory = content);
  };


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  };

}
