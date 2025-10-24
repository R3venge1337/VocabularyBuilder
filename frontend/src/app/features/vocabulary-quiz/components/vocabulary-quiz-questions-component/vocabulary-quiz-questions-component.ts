import { CommonModule } from '@angular/common';
import { Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuizDto } from '../../models/quizDto';
import { QuizViewDto } from '../../models/quizViewDto';
import { QuizItemResultDto, QuizResultsDto } from '../../models/quizResultsDto';
import { VocabularyQuizService } from '../../services/vocabulary-quiz-service';

@Component({
  selector: 'app-vocabulary-quiz-questions-component',
  imports: [CommonModule,FormsModule],
  templateUrl: './vocabulary-quiz-questions-component.html',
  styleUrl: './vocabulary-quiz-questions-component.scss'
})
export class VocabularyQuizQuestionsComponent {

 constructor(private quizService:VocabularyQuizService){}

  quizData = input.required<QuizDto>();
  cancelQuiz = output<boolean>();
  dataSaved = output<QuizViewDto>();
  isQuizFinishedOutput = output<boolean>();

  // Stan quizu
  currentIndex = signal(0);
  userAnswer: string = '';
  isChecking = signal(false); // Blokuje przyciski podczas sprawdzania (symulacja API)
  correctAnswers = signal(0);
  
  // Stan stopera
  totalSeconds = signal(0);
  private timerInterval: any;

  // Wartości obliczane (computed)
 totalWords = computed(() => this.quizData().totalQuestions);
 private quizResults = signal<QuizItemResultDto[]>([]);

  // --- Sygnały Zakończenia i Wysyłki ---
  isQuizFinished = signal(false); // Sygnał sprawdzający, czy quiz się zakończył
  isSubmitting = signal(false);
  submissionError = signal<string | null>(null);
  quizSummary = signal<QuizViewDto | null>(null);
  
  currentWord = computed(() => {
    const data = this.quizData();
    // Używam QuizDto jako kontenera dla bieżącego "słowa"
    return this.currentIndex() < data.totalQuestions ? { 
        questions: [data.questions[this.currentIndex()]] 
    } : null;
  });

  formattedTime = computed(() => {
    const total = this.totalSeconds();
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  });

  ngOnInit(): void {
    this.startTimer();
  }
  
  // --- Metody Stopera ---
  startTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.timerInterval = setInterval(() => {
      this.totalSeconds.update(s => s + 1);
    }, 1000);
  }

  stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  // --- Metody Quizu ---
  checkAnswer(): void {
    if (!this.userAnswer.trim() || this.isChecking()) return;

    this.isChecking.set(true);
    
    // Symulacja sprawdzania odpowiedzi po stronie serwera/API
    setTimeout(() => {
        const currentQ = this.quizData().questions[this.currentIndex()];
        
        // Zgodnie z nowym szablonem, tłumaczymy PL -> EN
        const isCorrect = this.userAnswer.trim().toLowerCase() === currentQ.translation.trim().toLowerCase();
        
        if (isCorrect) {
          this.correctAnswers.update(count => count + 1);
        }

        console.log(`Pytanie ID ${this.currentIndex} - Odpowiedź: ${isCorrect ? 'POPRAWNA' : 'BŁĘDNA'}`);
          if (currentQ) {
      // 1. Zapisz wynik odpowiedzi
      const result: QuizItemResultDto = {
        entryId: currentQ.vocabularyEntryId,
        userAnswer: this.userAnswer
      };
      this.quizResults.update(results => [...results, result]);
    }

        this.goToNextQuestion();

    }, 500); // Małe opóźnienie dla symulacji sprawdzania
  }

   goToNextQuestion(): void {
    this.userAnswer = '';
    this.isChecking.set(false);

    // Sprawdza, czy bieżący indeks to ostatni element
    const isLastQuestion = this.currentIndex() === this.totalWords() - 1;

    if (!isLastQuestion) {
      // Przejdź do następnego pytania
      this.currentIndex.update(index => index + 1);
    } else {
      // Koniec quizu -> wywołanie zapisu wyników
      this.stopTimer();
      this.finishAndSubmitQuiz();
    }
  }

    finishAndSubmitQuiz(): void {
    this.isQuizFinished.set(true);
    this.isSubmitting.set(true);
    this.submissionError.set(null); // Reset błędu

    const finalResults: QuizResultsDto = {
      quizUuid: this.quizData().quizUuid,
      durationSeconds: this.totalSeconds(),
      results: this.quizResults()
    };
    
    // Wysłanie wyników do serwera
    this.quizService.submitQuizResults(finalResults).subscribe({
        next: (summary) => {
            this.isSubmitting.set(false);
            this.quizSummary.set(summary);
            console.log('Zapis wyników zakończony sukcesem:', summary);
            this.dataSaved.emit(summary);
            this.isQuizFinishedOutput.emit(this.isQuizFinished());
        },
        error: (error) => {
            this.submissionError.set(error.message || 'Nieznany błąd zapisu.');
            this.isSubmitting.set(false);
            console.error('Błąd zapisu wyników quizu:', error);
        }
    });
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }
}
