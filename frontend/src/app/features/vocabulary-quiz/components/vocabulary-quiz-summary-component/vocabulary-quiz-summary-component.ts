import { CommonModule } from '@angular/common';
import { Component, computed, input, OnInit, output, signal } from '@angular/core';
import { QuizResultsDto } from '../../models/quizResultsDto';
import { VocabularyQuizService } from '../../services/vocabulary-quiz-service';
import { QuizViewDto } from '../../models/quizViewDto';

@Component({
  selector: 'app-vocabulary-quiz-summary-component',
  imports: [CommonModule],
  templateUrl: './vocabulary-quiz-summary-component.html',
  styleUrl: './vocabulary-quiz-summary-component.scss'
})
export class VocabularyQuizSummaryComponent implements OnInit {

    constructor(private quizService: VocabularyQuizService){}
    quizUuid = input.required<string>();
    startNewQuiz = output<void>();
    summary = signal<QuizViewDto | null>(null);
    isLoading = signal(true);
    error = signal<string | null>(null);

    ngOnInit(): void {
        this.loadSummary();
    }

    loadSummary(): void {
        this.isLoading.set(true);
        this.error.set(null);
        
        this.quizService.getQuizDetails(this.quizUuid()).subscribe({
            next: (data) => {
                this.summary.set(data);
                this.isLoading.set(false);
            },
            error: (err) => {
                this.error.set(err.message || 'Nie udało się załadować podsumowania.');
                this.isLoading.set(false);
            }
        });
    }

     formattedTime = computed(() => {
    const total = this.summary()?.durationSeconds;
    const minutes = Math.floor(total! / 60);
    const seconds = total! % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  });
}