import { Component, inject, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { WeblinksService } from '../services/weblinks.service';
import { Weblinks } from 'src/app/shared/interfaces/weblinks.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-weblinks-page',
  templateUrl: './weblinks-page.component.html',
  styleUrls: ['./weblinks-page.component.css']
})
export class WeblinksComponent implements OnInit, OnDestroy {

  private weblinksService = inject(WeblinksService);
  private modalService = inject(NgbModal);
  public links!: Weblinks[];
  public modalTitle: string = '';
  public currentLinks!: Weblinks[];
  public categorizedLinks: { [category: string]: Weblinks[] } = {};
  private unsubscribe$ = new Subject<void>();




  ngOnInit(): void {
    this.getAllLinks()
  }


  // getAllLinks(): void {
  //   this.weblinksService.getAllWeblinks()
  //     .pipe(
  //       takeUntil(this.unsubscribe$)
  //     )
  //     .subscribe(data => {
  //       data.forEach(link => {
  //         const category = link.category;

  //         if (!this.categorizedLinks[category]) {
  //           this.categorizedLinks[category] = [];
  //         }

  //         this.categorizedLinks[category].push(link);
  //       });
  //     });
  // }



  getAllLinks(): void {
    this.weblinksService.getAllWeblinks()
      
      .subscribe(data => {
        console.log(data)
        // data.forEach(link => {
        //   const category = link.category;

        //   if (!this.categorizedLinks[category]) {
        //     this.categorizedLinks[category] = [];
        //   }

        //   this.categorizedLinks[category].push(link);
        // });
      });
  }


  openMainModal(template: TemplateRef<Weblinks[]>, title: string, links: string): void {
    this.modalService.open(template, { centered: true });
    this.modalTitle = title;
    this.currentLinks = this.categorizedLinks[links];
  }


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


}