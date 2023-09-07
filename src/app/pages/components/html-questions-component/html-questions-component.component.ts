import { Component, inject } from '@angular/core';
import { PagesService } from '../../services/pages.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-html-questions-component',
  templateUrl: './html-questions-component.component.html',
  styleUrls: ['./html-questions-component.component.css']
})
export class HtmlQuestionsComponentComponent {
  private pagesService = inject(PagesService)
  public category : string = 'Angular';
  public level    : string = 'Middle';
  
  private unsubscribe$ = new Subject<void>();

  ngOnInit(): void {
    this.pagesService.selectedCategory$
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(categoryFromService => this.category = categoryFromService);
    this.pagesService.selectedLevel$
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(levelFromService => this.level = levelFromService);
  }
  ngOnDestroy(){
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
