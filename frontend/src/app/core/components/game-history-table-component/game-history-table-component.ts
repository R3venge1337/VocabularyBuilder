import { Component, input, output } from '@angular/core';
import { GameStateDto } from '../../../features/tic-tac-toe/models/gameStateDto';
import { GameHistoryDto } from '../../../shared/models/gameHistoryDto';
import { GameResult } from '../../../shared/enums/gameResult';
import { GameType } from '../../../shared/enums/gameType';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-game-history-table-component',
  imports: [CommonModule],
  templateUrl: './game-history-table-component.html',
  styleUrl: './game-history-table-component.scss'
})
export class GameHistoryTableComponent {
    historyList = input.required<GameHistoryDto[]>();
    isLoading = input.required<boolean>();
    error = input.required<string | null>();

    refreshHistory = output<void>();
    showDetails = output<GameHistoryDto>();

    getTypeLabel(type: GameType): string {
        if(type.toString() === 'TIC_TAC_TOE') {
          return "TICTACTOE"
        }
        return 'NIEZNANY'
    }

    getResultLabel(result: GameResult): string {
        return GameResult[result] || 'Nieznany';
    }

    getResultClass(result: GameResult): string {
        switch (result) {
            case GameResult.WIN: return 'result-win';
            case GameResult.LOSE: return 'result-lose';
            case GameResult.DRAW: return 'result-draw';
            default: return 'result-abandoned';
        }
    }

    formatDate(datePlayed: string): string {
        try {
            const date = new Date(datePlayed);
            return date.toLocaleDateString('pl-PL', {
                year: 'numeric', month: 'numeric', day: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });
        } catch (e) {
            return datePlayed;
        }
    }
}
