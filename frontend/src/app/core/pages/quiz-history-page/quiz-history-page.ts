import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { VocabularyQuizService } from '../../../features/vocabulary-quiz/services/vocabulary-quiz-service';
import { QuizHistoryDto } from '../../../shared/models/quizHistoryDto';
import { QuizHistoryTableComponent } from "../../components/quiz-history-table-component/quiz-history-table-component";
import { QuizViewDto } from '../../../features/vocabulary-quiz/models/quizViewDto';
import { QuizHistoryDetailsComponent } from "../../components/quiz-history-details-component/quiz-history-details-component";

@Component({
  selector: 'app-quiz-history-page',
  imports: [QuizHistoryTableComponent, QuizHistoryDetailsComponent],
  templateUrl: './quiz-history-page.html',
  styleUrl: './quiz-history-page.scss'
})
export class QuizHistoryPage implements OnInit {

  NUMBER_OF_GAMES  = 20;
  quizHistoryList: WritableSignal<QuizHistoryDto[]> = signal([]);
  isLoading = signal(false);
  error = signal<string | null>(null);
  selectedGame: WritableSignal<QuizHistoryDto | null> = signal(null);
  quizDetails: WritableSignal<QuizViewDto | null> = signal(null);

  constructor(private vocabularyQuizService: VocabularyQuizService) {}
  ngOnInit(): void {
    this.loadQuizHistory(this.NUMBER_OF_GAMES);
  }

     loadQuizHistory(limit: number) {
        this.isLoading.set(true);
        this.error.set(null);
        this.clearSelectedGame();
        this.vocabularyQuizService.getRecentQuizzes(limit).subscribe(
        {
          next: (response: QuizHistoryDto[]) => {
            this.quizHistoryList.set(response);
            this.isLoading.set(false);
                },
                error: (err) => {
                    console.error("Błąd podczas ładowania historii:", err);
                    this.error.set('Nie udało się wczytać danych historii.');
                    this.isLoading.set(false);
                }
        })
    }; 

    getDetailsAboutQuiz(quizUuid:string) {
    this.isLoading.set(true);
    this.error.set(null);
    this.quizDetails.set(null);
      this.vocabularyQuizService.getQuizDetails(quizUuid).subscribe(
        {
          next: (response: QuizViewDto) => {
            this.quizDetails.set(response);
            this.isLoading.set(false);
                },
                error: (err) => {
                    console.error("Błąd podczas ładowania szczegółów quizu:", err);
                    this.error.set('Nie udało się wczytać danych historii.');
                    this.selectedGame.set(null);
                    this.isLoading.set(false);
                }
        })
    }

  setSelectedGame(event: QuizHistoryDto): void {
    this.selectedGame.set(event);
    this.getDetailsAboutQuiz(event.quizUuid);
  }

clearSelectedGame(): void {
    this.selectedGame.set(null);
    this.quizDetails.set(null);
    this.error.set(null);
  }

}
