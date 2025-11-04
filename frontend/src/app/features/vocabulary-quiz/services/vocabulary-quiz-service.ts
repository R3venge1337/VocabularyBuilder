import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ContextSource } from '../../../shared/enums/contextSource';
import { count, Observable } from 'rxjs';
import { QuizDto } from '../models/quizDto';
import { QuizViewDto } from '../models/quizViewDto';
import { QuizResultsDto } from '../models/quizResultsDto';
import { QuizHistoryDto } from '../../../shared/models/quizHistoryDto';

@Injectable({
  providedIn: 'root'
})
export class VocabularyQuizService {
  private API_URL: string = "http://localhost:8080/api/v1";

   constructor(private http: HttpClient) {}

   generateQuizQuestionsWithQuizUuid(count: number):  Observable<any>{
      let params = new HttpParams();
      params = params.set('count', count );
      return this.http.get<QuizDto>(`${this.API_URL}/quizzes/generate`, { params: params });
   }

    submitQuizResults(results: QuizResultsDto):  Observable<any>{
      return this.http.post<QuizViewDto>(`${this.API_URL}/quizzes/submit`, results );
   }

   getQuizDetails(quizUuid: string): Observable<any> {
    return this.http.get<QuizViewDto>(`${this.API_URL}/quizzes/`+quizUuid);
   }

   getRecentQuizzes(limit: number): Observable<any> {
    let params = new HttpParams();
    params = params.set('limit', limit);
    return this.http.get<QuizHistoryDto>(`${this.API_URL}/quizzes/history`, {params: params});
   }
}
