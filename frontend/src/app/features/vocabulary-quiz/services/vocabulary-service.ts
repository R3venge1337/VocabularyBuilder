import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {CreateVocabularyEntryForm } from "../models/createVocabularyEntryForm"
import { VocabularyEntryView } from '../models/vocabularyEntryView';
import { UpdateVocabularyEntryForm } from '../models/updateVocabularyEntryForm';
import { PageDto } from '../../../shared/models/pageDto';
import { PageableRequest } from '../../../shared/models/pageableRequest';
import { FilterVocabularyEntryForm } from '../models/filterVocabularyEntryForm';
@Injectable({
  providedIn: 'root'
})
export class VocabularyService {
  private API_URL: string = "http://localhost:8080/api/v1";

  constructor(private http: HttpClient) {}

  getEntries(filterForm: FilterVocabularyEntryForm, pageableRequest: PageableRequest): Observable<PageDto<VocabularyEntryView>> {
    let params = new HttpParams();
    params = params.set('page', pageableRequest.page.toString());
    params = params.set('size', pageableRequest.size.toString())
    if (pageableRequest.sortField) {
        params = params.set('sortField', pageableRequest.sortField);
        params = params.set('sortDirection', pageableRequest.sortDirection);
    }
    if (filterForm.word) {
        params = params.set('word',filterForm.word );
    }

    if (filterForm.masteryStatus) {
        params = params.set('masteryStatus', filterForm.masteryStatus);
    }

    if (filterForm.partOfSpeech) {
        params = params.set('partOfSpeech', filterForm.partOfSpeech);
    }

    if (filterForm.contextSource) {
        params = params.set('contextSource', filterForm.contextSource);
    }

    return this.http.get<PageDto<VocabularyEntryView>>(`${this.API_URL}/vocabulary`,{params: params });
  }

  getEntryById(id: number): Observable<any> {
    return this.http.get<VocabularyEntryView>(`${this.API_URL}/vocabulary/${id}`);
  }
  createEntry(form: CreateVocabularyEntryForm): Observable<any> {
    return this.http.post<VocabularyEntryView>(`${this.API_URL}/vocabulary`, form);
  }

  updateEntry(id: number, form: UpdateVocabularyEntryForm): Observable<any> {
    return this.http.put<VocabularyEntryView>(`${this.API_URL}/vocabulary/${id}`, form);
  }
  deleteEntry(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/posts/${id}`);
  }

}
