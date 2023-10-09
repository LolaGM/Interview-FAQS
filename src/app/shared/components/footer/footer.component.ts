import {Component,TemplateRef,inject} from '@angular/core';
import { Contributor } from '../../interfaces/contributors.interface';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {

  private modalService = inject(NgbModal);
  public isContributorListShown: boolean = false;
  public selectedArray: Contributor[] = [];
  public contributors: Contributor[] = [
    {
      image: '../../../../assets/images/lola-garcia.jpg',
      contributor: 'Lola García Morcillo',
      link: 'https://www.linkedin.com/in/lola-garcia-morcillo',
    },
    {
      image: '../../../../assets/images/carlos-photo.jpg',
      contributor: 'Carlos Ortiz Sánchez',
      link: 'https://www.linkedin.com/in/carlosortizsanchez/',
    },
    {
      image: '../../../../assets/images/jesus-villalon.jpg',
      contributor: 'Jesús Villalón Gallardo',
      link: 'https://www.linkedin.com/in/jesus-villalon/',
    },
    {
      image: '../../../../assets/images/david-photo.jpg',
      contributor: 'David Galisteo Pujol',
      link: 'https://es.linkedin.com/in/davidgalisteopujol',
    },
    {
      image: '../../../../assets/images/daniel-sanchez.jpg',
      contributor: 'Daniel Sánchez Pinazo',
      link: 'https://www.linkedin.com/in/daniel-sanchez-pinazo/',
    },
    {
      image: '../../../../assets/images/ricardo-mera.jpg',
      contributor: 'Ricardo Mera Ciudad',
      link: 'https://es.linkedin.com/in/ricardo-mera-ciudad-26b58a159/',
    },
    {
      image: '../../../../assets/images/gio-photo.jpg',
      contributor: 'Giovanni Martínez Díaz',
      link: 'https://es.linkedin.com/in/giovanni-jose-mart%C3%ADnez-d%C3%ADaz-',
    },
  ];


  closeMenu() {
    this.selectedArray = [];
  };

  openVerticallyCentered(content: TemplateRef<any>) {
		this.modalService.open(content, { centered: true });
	};
}
