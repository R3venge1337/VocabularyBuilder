import { Component, computed, input, output, signal, WritableSignal } from '@angular/core';
import { GameHistoryDto } from '../../../shared/models/gameHistoryDto';
import { GameReplayDto } from '../../../shared/models/gameReplayDto';
import { CommonModule, NgClass } from '@angular/common';
import { GameResult } from '../../../shared/enums/gameResult';
import { GameType } from '../../../shared/enums/gameType';
import { GameMoveDto } from '../../../features/tic-tac-toe/models/gameMoveDto';
import { GameSide } from '../../../shared/enums/gameSide';

@Component({
  selector: 'app-game-history-details-component',
  imports: [CommonModule,NgClass],
  templateUrl: './game-history-details-component.html',
  styleUrl: './game-history-details-component.scss',
  standalone: true
})
export class GameHistoryDetailsComponent {
 selectedMoveIndex: WritableSignal<number> = signal(-1);
  game = input<GameHistoryDto | null>(null);
  goBack = output<void>();
  replay = input<GameReplayDto | null>(null); 
   readonly GameSide = GameSide; 
   moveSelected = output<GameMoveDto | null>();

    getTypeLabel(type: GameType): string {
        if (type.toString() === 'TIC_TAC_TOE') {
            return "TICTACTOE"
        }
        return 'NIEZNANY'
    }

    getResultLabel(result: GameResult): string {
        switch (result) {
            case GameResult.WIN: return 'Wygrana';
            case GameResult.LOSE: return 'Przegrana';
            case GameResult.DRAW: return 'Remis';
            default: return 'Nieznany';
        }
    }

    getResultClass(result: GameResult): string {
        switch (result) {
            case GameResult.WIN: return 'result-win';
            case GameResult.LOSE: return 'result-lose';
            case GameResult.DRAW: return 'result-draw';
            default: return 'result-abandoned';
        }
    }
    
 
    getCoordinates(move: GameMoveDto): string {
        return `(${move.row + 1}, ${move.col + 1})`;
    }

      getBoardState = computed<Array<Array<GameSide | null>>>(() => {
        const moves = this.replay()?.moves || [];
        const maxIndex = this.selectedMoveIndex();

        const state: Array<Array<GameSide | null>> = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];

        for (let i = 0; i <= maxIndex; i++) {
            const move = moves[i];
            if (move && move.row >= 0 && move.row < 3 && move.col >= 0 && move.col < 3) {
                state[move.row][move.col] = move.playerSide;
            }
        }
        return state;
    });

    getCurrentMove(): GameMoveDto | undefined {
        const moves = this.replay()?.moves;
        const index = this.selectedMoveIndex();
        return moves && index >= 0 && index < moves.length ? moves[index] : undefined;
    }

    isActiveMove(row: number, col: number): boolean {
        const currentMove = this.getCurrentMove();
        if (!currentMove) return false;
        return currentMove.row === row && currentMove.col === col;
    }

      goToNextMove(): void {
        const maxMoves = this.replay()?.moves.length || 0;
        this.selectedMoveIndex.update(idx => Math.min(maxMoves - 1, idx + 1));
    }

    goToPreviousMove(): void {
        this.selectedMoveIndex.update(idx => Math.max(-1, idx - 1));
    }

     playerLabels = computed(() => {
    const replayData = this.replay();
    
    if (!replayData) {
        return { 
            main: 'Gracz X', opponent: 'Gracz O', 
            mainSymbol: GameSide.X, opponentSymbol: GameSide.O 
        }; 
    }
    
    const mainSide = replayData.playerSide;
    const opponentSide = mainSide === GameSide.X.toString() ? GameSide.O : GameSide.X;
    let opponentLabel = `Przeciwnik (${opponentSide})`;
   
    return {
        main: `Ja (${mainSide})`,
        opponent: opponentLabel,
        mainSymbol: mainSide,
        opponentSymbol: opponentSide
    };
  });

  getPlayerLabel(movePlayer: GameSide): string {
      const labels = this.playerLabels();
      if (movePlayer == labels.mainSymbol) {
          return labels.main;
      }
      if (movePlayer == labels.opponentSymbol) {
          return labels.opponent;
      }
      return 'Nieznany Gracz'; 
  }

   selectMoveAndEmit(moveIndex: number): void {
      this.selectedMoveIndex.set(moveIndex);
      
      const moves = this.replay()?.moves;
      
      if (moveIndex === -1 || !moves) {
          this.moveSelected.emit(null);
      } else if (moveIndex >= 0 && moveIndex < moves.length) {
          this.moveSelected.emit(moves[moveIndex]);
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
