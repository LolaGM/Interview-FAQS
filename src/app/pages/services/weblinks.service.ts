import { Injectable, inject } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { Observable,  from, map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class WeblinksService {

  private firestore = inject(Firestore);

  
  getAllWeblinks(): Observable<any> {
    const weblinksRef = collection(this.firestore, 'weblinks');
    return from(getDocs(weblinksRef)).pipe(
      map(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    );
  }


  

}
