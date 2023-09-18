import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Question } from 'src/app/shared/interfaces/answerQuestion.interface';
import { environments } from 'src/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = environments.baseUrl;

  constructor(private http: HttpClient) {}




  getQuestions(category: string, level?: string): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/questions`)
      .pipe(
        map((questions: Question[]) => {
          return questions.filter((question) => {
            const matchCategory = question.category === category;
            const matchLevel = level ? question.level === level : true;
            return matchCategory && matchLevel;
          });
        })
      )
  }


}
