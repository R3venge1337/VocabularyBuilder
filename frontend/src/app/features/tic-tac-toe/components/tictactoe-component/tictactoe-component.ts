import { Component, computed, input, output } from '@angular/core';
import { GameStateDto } from '../../models/gameStateDto';
import { MoveRequestDto } from '../../models/moveRequestDto';
import { NgClass } from '@angular/common';

export type WinCoordinate = [number, number]; 

@Component({
  selector: 'app-tictactoe-component',
  imports: [NgClass],
  templateUrl: './tictactoe-component.html',
  styleUrl: './tictactoe-component.scss'
})
export class TictactoeComponent {
   // INPUTS - Komunikacja od Rodzica do Dziecka
    gameState = input.required<GameStateDto>();
    isLoading = input.required<boolean>();
    errorMsg = input.required<string | null>();

    // OUTPUTS - Komunikacja od Dziecka do Rodzica (Zdarzenia)
    gameStarted = output<void>();
    moveRequested = output<MoveRequestDto>();

    // Właściwość obliczana do sprawdzenia, czy gra się skończyła
    isGameOver = computed(() =>  !!this.gameState().result);

    /**
     * Sprawdza, czy ruch w daną komórkę jest możliwy.
     */
    isMovePossible(row: number, col: number): boolean {
        const state = this.gameState();
        // Ruch jest możliwy, jeśli: nie trwa ładowanie, gra nie jest skończona, pole jest puste 
        // I jest to tura gracza, który został przydzielony komponentowi (playerSide)
        return !this.isLoading() && 
               !this.isGameOver() && 
               state.board[row]![col] === null &&
               state.nextPlayer === state.nextPlayer;
    }

    /**
     * Obsługuje kliknięcie komórki i emituje żądanie ruchu do komponentu rodzica.
     */
    handleCellClick(row: number, col: number): void {
        const state = this.gameState();

        if (this.isMovePossible(row, col)) {
            
            const moveReq: MoveRequestDto = {
                gameId: state.gameId!,
                row: row,
                col: col
            };
            this.moveRequested.emit(moveReq);
        } else if (state.gameId && !this.isGameOver() && state.nextPlayer !== state.nextPlayer) {
             console.error(`Poczekaj na ruch gracza ${state.nextPlayer}.`);
        }
    }

      // Oblicza klasę CSS dla linii zwycięstwa
    winLineClass = computed(() => {
        const line = this.parseWinLine(this.gameState().wonCoordinates); 
        if (!line || line.length === 0) return '';
        
        // Wiersze
        if (line[0][0] === line[1][0] && line[1][0] === line[2][0]) {
            return `line-row-${line[0][0]}`;
        }
        // Kolumny
        if (line[0][1] === line[1][1] && line[1][1] === line[2][1]) {
            return `line-col-${line[0][1]}`;
        }
        // Przekątne
        if (line[0][0] === 0 && line[0][1] === 0 && line[2][0] === 2 && line[2][1] === 2) {
            return 'line-diag-1';
        }
        // Antyprzekątna
        if (line[0][0] === 0 && line[0][1] === 2 && line[2][0] === 2 && line[2][1] === 0) {
            return 'line-diag-2';
        }
        return '';
    });


    private parseWinLine(line: string | null): number[][] | null {
        if (!line) return null;
        try {
            // Wymagany rzutowanie, ponieważ JSON.parse zwraca 'any'
            const parsed: number[][] = JSON.parse(line);
            // Sprawdzenie, czy struktura jest sensowna, np. czy jest to tablica
            if (Array.isArray(parsed) && parsed.every(Array.isArray)) {
                return parsed;
            }
            return null;
        } catch (e) {
            console.error("Błąd parsowania winLine:", e);
            return null;
        }
    }

    // Sprawdza, czy dana komórka należy do zwycięskiej linii
    isCellInWinLine(r: number, c: number): boolean {
        const line = this.parseWinLine(this.gameState().wonCoordinates); 
        // Sprawdź tylko, jeśli gra jest zakończona zwycięstwem
        if (this.gameState().result !== 'WIN' || !line) return false;
        
        // Sprawdzanie, czy współrzędne (r, c) znajdują się w tablicy 'line'
        return line.some(coord => coord[0] === r && coord[1] === c);
    }

}
