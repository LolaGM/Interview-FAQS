import { Injectable, OnDestroy, inject } from '@angular/core';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { Observable, Subject, from, of } from 'rxjs';
import { Firestore, collection, getDocs, doc, updateDoc, query, where } from '@angular/fire/firestore';
import { Question } from 'src/app/shared/interfaces/answerQuestion.interface';
import { UserService } from 'src/app/auth/services/user.service';


@Injectable({
  providedIn: 'root',
})
export class DataService implements OnDestroy {

  private firestore = inject(Firestore);
  private userService = inject(UserService)

  private unsubscribe$ = new Subject<void>();


  getQuestions(category: string, level?: string): Observable<any> {
    const questionsRef = collection(this.firestore, 'questions');
    return from(getDocs(questionsRef)).pipe(
      map(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))),
      map(questions => {
        if (level) {
          return questions.filter(
            (question: any) =>
              question.category === category && question.level === level
          );
        } else {
          return questions.filter((question: any) => question.category === category);
        }
      })
    );
  }


  getRandomQuestions(category: string, count: number): Observable<Question[]> {
    return this.getQuestions(category).pipe(
      map((questions) => {
        if (questions.length <= count) {
          return questions;
        } else {
          const shuffledQuestions = questions.slice().sort(() => 0.5 - Math.random());
          return shuffledQuestions.slice(0, count);
        }
      })
    )
  }


  markQuestionAsFavorite(questionId: number) {
    this.userService.getAuthenticatedUserSubject()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(async (user) => {
        if (!user) {
          return null;
        }

        const userCollection = collection(this.firestore, 'users');
        const q = query(userCollection, where('id', '==', user.id));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.error("No se encontró el documento del usuario");
          return false;
        }

        const userDoc = querySnapshot.docs[0];
        const docId = userDoc.id;
        user.favoriteQuestions.push(questionId);
        const userRef = doc(this.firestore, 'users', docId);
        const userData = { favoriteQuestions: user.favoriteQuestions };

        try {
          await updateDoc(userRef, userData);
          return true;
        } catch (error) {
          console.error("Error updating document: ", error);
          return false;
        }
      });
  }



  unmarkQuestionAsFavorite(questionId: number) {
    this.userService.getAuthenticatedUserSubject()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(async (user) => {
        if (!user) {
          return null;
        }

        user.favoriteQuestions = user.favoriteQuestions.filter(id => id !== questionId);
        const userCollection = collection(this.firestore, 'users');
        const q = query(userCollection, where('id', '==', user.id));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.error("No se encontró el documento del usuario");
          return false;
        }

        const userDoc = querySnapshot.docs[0];
        const docId = userDoc.id;
        const userRef = doc(this.firestore, 'users', docId);
        const userData = { favoriteQuestions: user.favoriteQuestions };

        try {
          await updateDoc(userRef, userData);
          return true;
        } catch (error) {
          console.error("Error updating document: ", error);
          return false;
        }
      });
  }


  getFavoriteQuestions(): any {
    return this.userService.getAuthenticatedUserSubject()
      .pipe(
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


  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

}
