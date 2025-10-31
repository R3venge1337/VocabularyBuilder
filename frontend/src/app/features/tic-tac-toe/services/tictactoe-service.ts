import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GameDto } from '../models/gameDto';
import { Observable } from 'rxjs';
import { GameStateDto } from '../models/gameStateDto';
import { MoveRequestDto } from '../models/moveRequestDto';

@Injectable({
  providedIn: 'root'
})
export class TictactoeService {

  private API_URL: string = "http://localhost:8080/api/v1";
  
    constructor(private http: HttpClient) {}

    startGame(): Observable<any> {
     return this.http.post<GameDto>(`${this.API_URL}/games/start`, {});
    }

    makeMove(moveReq: MoveRequestDto): Observable<any> {
      return this.http.post<GameStateDto>(`${this.API_URL}/games/move`, moveReq);
    }
}
