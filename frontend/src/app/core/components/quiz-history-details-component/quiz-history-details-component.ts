import { Component, input, output } from '@angular/core';
import { QuizViewDto } from '../../../features/vocabulary-quiz/models/quizViewDto';
import { MasteryStatus } from '../../../shared/enums/masterStatus';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quiz-history-details-component',
  imports: [CommonModule],
  templateUrl: './quiz-history-details-component.html',
  styleUrl: './quiz-history-details-component.scss'
})
export class QuizHistoryDetailsComponent {

  quizDetails = input<QuizViewDto | null>(null);

   closeDetails = output<void>();

     constructor(){
}

  getAccuracyClass(accuracyPercent: number): string {
    if (accuracyPercent >= 90) {
      return 'accuracy-excellent';
    } else if (accuracyPercent >= 70) {
      return 'accuracy-good';
    } else {
      return 'accuracy-poor';
    }
  }

  getMasteryStatusLabel(status: MasteryStatus): string {
    switch (status) {
      case MasteryStatus.MASTERED:
        return 'Opanowane';
      case MasteryStatus.LEARNING:
        return 'W trakcie nauki';
      case MasteryStatus.TO_REVIEW:
        return 'Do powtórki';
      default:
        return 'Nieznany';
    }
  }
}
