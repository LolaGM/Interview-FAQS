import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData  } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { UserData } from 'src/app/shared/interfaces/user-data.interface';
import { Weblinks } from 'src/app/shared/interfaces/weblinks.interface';
import { environments } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class WeblinksService {

  private http = inject(HttpClient);
  private apiUrl = environments.baseUrl;
  

  constructor(
    private firestore: Firestore,
) { }


  // getAllWeblinks():Observable<Weblinks[]>{
  //   return this.http.get<Weblinks[]>(`${this.apiUrl}/weblinks`)
  // }

  getAllWeblinks():Observable<UserData[]>{
    const questionsRef = collection(this.firestore, 'users');
    return collectionData(questionsRef, {idField:'id'}) as Observable<any>
  }
  

}
