import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { Observable, from, of } from 'rxjs';
import { Firestore, collection, addDoc, getDocs, doc, getDoc,updateDoc, collectionData, query, where } from '@angular/fire/firestore';
import { UsersService } from 'src/app/auth/services/users.service';
import { Question } from 'src/app/shared/interfaces/answerQuestion.interface';
import { environments } from 'src/environment/environment';
import { UserService } from 'src/app/auth/services/user.service';


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
        this.userService.getAuthenticatedUserSubject().subscribe(async (user) => {
          if (!user) {
            return null;
          }
          
          // Crea una consulta para buscar el documento del usuario
          const userCollection = collection(this.firestore, 'users');
          const q = query(userCollection, where('id', '==', user.id));
          
          // Ejecuta la consulta y obtén los documentos
          const querySnapshot = await getDocs(q);
          
          // Verifica si se encontró el documento del usuario
          if (querySnapshot.empty) {
            console.error("No se encontró el documento del usuario");
            return false;
          }
          
          // Obtiene el primer documento de los resultados de la consulta
          const userDoc = querySnapshot.docs[0];
          
          // Obtiene el ID del documento
          const docId = userDoc.id;
          
          // Añade questionId a favoriteQuestions
          user.favoriteQuestions.push(questionId);
          
          // Obtiene una referencia al documento del usuario utilizando el ID del documento
          const userRef = doc(this.firestore, 'users', docId);
          
          // Prepara los datos del usuario para la actualización
          const userData = { favoriteQuestions: user.favoriteQuestions };
      
          try {
            // Actualiza el documento en Firestore
            await updateDoc(userRef, userData);
            console.log("Document successfully updated!");
            return true;
          } catch (error) {
            console.error("Error updating document: ", error);
            return false;
          }
        });
  }

  

unmarkQuestionAsFavorite(questionId: number) {
  this.userService.getAuthenticatedUserSubject().subscribe(async (user) => {
    if (!user) {
      return null;
    }
    
    // Elimina questionId de favoriteQuestions
    user.favoriteQuestions = user.favoriteQuestions.filter(id => id !== questionId);
    
    // Crea una consulta para buscar el documento del usuario
    const userCollection = collection(this.firestore, 'users');
    const q = query(userCollection, where('id', '==', user.id));
    
    // Ejecuta la consulta y obtén los documentos
    const querySnapshot = await getDocs(q);
    
    // Verifica si se encontró el documento del usuario
    if (querySnapshot.empty) {
      console.error("No se encontró el documento del usuario");
      return false;
    }
    
    // Obtiene el primer documento de los resultados de la consulta
    const userDoc = querySnapshot.docs[0];
    
    // Obtiene el ID del documento
    const docId = userDoc.id;
    
    // Obtiene una referencia al documento del usuario utilizando el ID del documento
    const userRef = doc(this.firestore, 'users', docId);
    
    // Prepara los datos del usuario para la actualización
    const userData = { favoriteQuestions: user.favoriteQuestions };

    try {
      // Actualiza el documento en Firestore
      await updateDoc(userRef, userData);
      console.log("Document successfully updated!");
      return true;
    } catch (error) {
      console.error("Error updating document: ", error);
      return false;
    }
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
