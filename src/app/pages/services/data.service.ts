import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { Observable, from, of } from 'rxjs';
import { Firestore, collection, addDoc, getDocs, doc, getDoc, } from '@angular/fire/firestore';
import { UsersService } from 'src/app/auth/services/users.service';
import { Question } from 'src/app/shared/interfaces/answerQuestion.interface';
import { environments } from 'src/environment/environment';
import { UserService } from 'src/app/auth/services/user.service';
import { updateDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class DataService {

  private apiUrl = environments.baseUrl;

  constructor(private http: HttpClient, private usersService: UsersService, private firestore:Firestore, private userService:UserService) {}

  // getQuestions(category: string, level?: string): Observable<Question[]> {
  //   return this.http.get<Question[]>(`${this.apiUrl}/questions`).pipe(
  //     map((questions: Question[]) => {
  //       console.log(questions)
  //       if (level) {
  //         return questions.filter(
  //           (question) =>
  //           {console.log(question)
  //             question.category === category && question.level === level}
  //         );
  //       } else {
  //         return questions.filter((question) => question.category === category);
  //       }
  //     })
  //   );
  // }

  getQuestions(category: string, level?: string): Observable<any> {
    const questionsRef = collection(this.firestore, 'questions');
    return from(getDocs(questionsRef)).pipe(
        map(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))),
        map(questions => {
            if (level) {
                return questions.filter(
                    (question:any) =>
                        question.category === category && question.level === level
                );
            } else {
                return questions.filter((question:any) => question.category === category);
            }
        })
    );
}


  getRandomQuestions(category: string, count: number): Observable<Question[]>{
    return this.getQuestions(category).pipe(
      map((questions) => {
        if(questions.length <= count){
          return questions;
        } else {
          const shuffledQuestions = questions.slice().sort(() => 0.5 - Math.random());
          return shuffledQuestions.slice(0, count);
        }
      })
    )
  }


  markQuestionAsFavorite(questionId: number) {
    this.userService.getAuthenticatedUserSubject().subscribe((user) => {
      if (!user) {
        return null;
      }
      user.favoriteQuestions.push(questionId);
     const userRef = doc(this.firestore, 'users');
    const userData = { ...user }; // Convert UserData to a plain object

    return updateDoc(userRef, userData)
      .then(() => console.log("Document successfully updated!"))
      .catch((error) => console.error("Error updating document: ", error));

      // return this.http.put(`${this.apiUrl}/users/${user.id}`, user)
      //   .subscribe(() => {});
    });
  }

  unmarkQuestionAsFavorite(questionId: number) {
    this.userService.getAuthenticatedUserSubject().subscribe((user) => {
      if (!user) {
        return null;
      }
      
      user.favoriteQuestions = user.favoriteQuestions.filter((id) => id !== questionId);
    

      const userRef = doc(this.firestore, 'users');
    const userData = { ...user }; // Convert UserData to a plain object

    return updateDoc(userRef, userData)
      .then(() => console.log("Document successfully updated!"))
      .catch((error) => console.error("Error updating document: ", error));

      // return this.http.put(`${this.apiUrl}/users/${user.id}`, user).subscribe(() => {
      // });
    });
  }



  // getFavoriteQuestions(): Observable<Question[]> {
  //   return this.userService.getAuthenticatedUserSubject().pipe(
  //     switchMap((user) => {
  //       if (!user) {
  //         return of([]);
  //       }

  //       // return this.http.get<Question[]>(`${this.apiUrl}/questions`).pipe(
  //       //   map((questions) =>
  //       //     questions.filter((question) => user.favoriteQuestions.includes(question.id))
  //       //   )
  //       // );



  //       const questionsRef = collection(this.firestore, 'questions');
  //       from(getDocs(questionsRef)).pipe(
  //           map(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))),
  //           map(questions => {
  //             questions.filter((question) => user.favoriteQuestions.includes(question.id))
  //           })
  //       );



  //     })
  //   );
  // }

  getFavoriteQuestions():any {
     return this.userService.getAuthenticatedUserSubject().pipe(
      switchMap((user) => {
        if (!user) {
          return of([]);
        }
  
        const questionsRef = collection(this.firestore, 'questions');
        return from(getDocs(questionsRef)).pipe(
          map(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))),
          map(questions => questions.filter((question) => user.favoriteQuestions.includes(parseInt(question.id))))
        );
      })
    );
  }

 

}
