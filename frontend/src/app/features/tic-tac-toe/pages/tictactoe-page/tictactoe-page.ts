import { Component, computed, signal, WritableSignal } from '@angular/core';
import { TictactoeComponent, WinCoordinate } from "../../components/tictactoe-component/tictactoe-component";
import { TictactoeService } from '../../services/tictactoe-service';
import { MoveRequestDto } from '../../models/moveRequestDto';
import { GameStateDto } from '../../models/gameStateDto';

@Component({
  selector: 'app-tictactoe-page',
  imports: [TictactoeComponent],
  templateUrl: './tictactoe-page.html',
  styleUrl: './tictactoe-page.scss'
})
export class TictactoePage {

     // Stan gry
    gameState: WritableSignal<GameStateDto> = signal({
        gameId: "",
        playerSide: "",
        board: [],
        nextPlayer: "",
        result: null,
        message: 'Kliknij "Rozpocznij Nową Grę" aby zacząć.',
        winningSide: "",
        wonCoordinates: ""
    })

     // Stan ładowania
    isLoading = signal(false);
    // Wiadomość o błędzie
    errorMsg = signal<string | null>(null);

  constructor(private tictactoeService: TictactoeService){}

  startGame() {
    this.isLoading.set(true);
    this.errorMsg.set(null);

      this.gameState.set({
            ...this.gameState(), 
            gameId: "", 
            message: 'Inicjowanie gry...' 
        })
    this.tictactoeService.startGame().subscribe({
      next: (response) => {
          const initialState: GameStateDto = {
                gameId: response.gameId,
                nextPlayer: response.playerSide,
                board: response.board,
                message: response.message,
                result: null,
                winningSide: response.winningSide,
                wonCoordinates: response.wonCoordinates
            };
          this.gameState.set(initialState);
          this.isLoading.set(false);
        console.log(`Plansza z backendu gotowa, Twój symbol: ${initialState.nextPlayer}`);
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Błąd startu tictactoe:', err);
        this.errorMsg.set('Nie udało się rozpocząć gry: ' + (err.message || 'Nieznany błąd.'));
      }
    });
  }

  makeMove(moveReq: MoveRequestDto) {
    this.isLoading.set(true);
    this.errorMsg.set(null);
     this.tictactoeService.makeMove(moveReq).subscribe({
      next: (response) => {
        this.gameState.set(response);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Błąd wykonania ruchu:', err);
      }
    });
  }
}
