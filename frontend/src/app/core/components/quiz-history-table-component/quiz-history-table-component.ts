import { Component, input, output } from '@angular/core';
import { QuizHistoryDto } from '../../../shared/models/quizHistoryDto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quiz-history-table-component',
  imports: [CommonModule],
  templateUrl: './quiz-history-table-component.html',
  styleUrl: './quiz-history-table-component.scss'
})
export class QuizHistoryTableComponent {

    historyList = input.required<QuizHistoryDto[]>();
    isLoading = input.required<boolean>();
    error = input.required<string | null>();

    refreshHistory = output<void>();
    showDetails = output<QuizHistoryDto>();
    

  getAccuracyClass(accuracyPercent: number): string {
    if (accuracyPercent >= 90) {
      return 'accuracy-excellent';
    } else if (accuracyPercent >= 70) {
      return 'accuracy-good';
    } else {
      return 'accuracy-poor';
    }
  }

  formatDate(dateString: string): string {
    try {
        if (!dateString) return 'Brak Danych';
        const date = new Date(dateString);
        return date.toLocaleDateString('pl-PL', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    } catch (e) {
        console.error('Błąd formatowania daty:', e);
        return dateString;
    }
  }

}
