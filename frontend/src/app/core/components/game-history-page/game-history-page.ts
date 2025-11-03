import { Component, signal, WritableSignal } from '@angular/core';
import { GameHistoryTableComponent } from "../game-history-table-component/game-history-table-component";
import { TictactoeService } from '../../../features/tic-tac-toe/services/tictactoe-service';
import { GameHistoryDto } from '../../../shared/models/gameHistoryDto';
import { GameReplayDto } from '../../../shared/models/gameReplayDto';
import { GameHistoryDetailsComponent } from '../game-history-details-component/game-history-details-component';

@Component({
  selector: 'app-game-history-page',
  imports: [GameHistoryTableComponent, GameHistoryDetailsComponent],
  templateUrl: './game-history-page.html',
  styleUrl: './game-history-page.scss'
})
export class GameHistoryPage {
  NUMBER_OF_GAMES  = 20;
  historyList: WritableSignal<GameHistoryDto[]> = signal([]);
  isLoading = signal(false);
  error = signal<string | null>(null);

    selectedGame: WritableSignal<GameHistoryDto | null> = signal(null);
    gameReplay: WritableSignal<GameReplayDto | null> = signal(null);
    isLoadingDetails = signal(false);
    detailsError = signal<string | null>(null);

  constructor(private tictactoeService: TictactoeService){
    this.loadGameHistory(this.NUMBER_OF_GAMES)
  }

    loadGameHistory(limit: number) {
      this.isLoading.set(true);
      this.error.set(null);
      this.selectedGame.set(null);
             this.tictactoeService.getHistory(limit).subscribe(
            {
              next: (response: GameHistoryDto[]) => {
                this.historyList.set(response);
                this.isLoading.set(false);
                console.log(`Pobrana została historia gier: ${response}`);
              },
              error: (err) => {
                  console.error("Błąd podczas ładowania historii:", err);
                  this.error.set('Nie udało się wczytać danych historii.');
                  this.isLoading.set(false);
              }
            }
             )
        }; 

      loadGameReplay(game: GameHistoryDto) {
        this.gameReplay.set(null); 
        this.detailsError.set(null);
        this.isLoadingDetails.set(true);
        this.selectedGame.set(game);
        this.tictactoeService.getReplay(game.sessionUuid).subscribe({
         next: (response: GameReplayDto) => {
              this.gameReplay.set(response);
              },
         error: (err) => {
            this.detailsError.set(err);
              },
          complete: () => {
          this.isLoadingDetails.set(false);
          }
            }) 
    }

    clearReplay(): void {
        this.gameReplay.set(null);
        this.detailsError.set(null);
    }
    
    clearDetailsError(): void {
        this.detailsError.set(null);
    }
}
