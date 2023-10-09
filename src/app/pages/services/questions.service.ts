import { Injectable, inject } from '@angular/core';
import { Firestore, collectionData } from '@angular/fire/firestore';
import { collection } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { QuestionWithAnswer } from 'src/app/shared/interfaces/answerQuestion.interface';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {

  private firestore = inject(Firestore)

  getQuestions(): Observable<QuestionWithAnswer[]> {
    const placeRef = collection(this.firestore, 'questions')
    return collectionData(placeRef, { idField: 'id' }) as Observable<QuestionWithAnswer[]>
  }
}