import { Component, OnInit, signal } from '@angular/core';
import { VocabularyQuizInfoComponent } from "../../components/vocabulary-quiz-info-component/vocabulary-quiz-info-component";
import { VocabularyService } from '../../services/vocabulary-service';
import { VocabularyQuizService } from '../../services/vocabulary-quiz-service';
import { QuizDto } from '../../models/quizDto';
import { catchError, of, tap } from 'rxjs';
import { VocabularyQuizQuestionsComponent } from '../../components/vocabulary-quiz-questions-component/vocabulary-quiz-questions-component';
import { VocabularyQuizSummaryComponent } from "../../components/vocabulary-quiz-summary-component/vocabulary-quiz-summary-component";
import { QuizViewDto } from '../../models/quizViewDto';

@Component({
  selector: 'app-vocabulary-quiz-page',
  imports: [VocabularyQuizInfoComponent, VocabularyQuizQuestionsComponent, VocabularyQuizSummaryComponent],
  templateUrl: './vocabulary-quiz-page.html',
  styleUrl: './vocabulary-quiz-page.scss'
})
export class VocabularyQuizPage implements OnInit {

 // --- Stany Aplikacji ---
  latestQuizUuid = signal<string | null>(null); 
  quizData = signal<QuizDto | null>(null);
  isGenerating = signal(false);
  isLoading = signal<boolean>(true); // Do ładowania początkowego (liczenie słów)
  totalEntriesCount = signal<number>(0);
  isFinished = signal<boolean>(false);
  isCanceled = signal<boolean>(true);
  
  constructor(private vocabularyService: VocabularyService, private quizService: VocabularyQuizService) {}

  ngOnInit(): void {
     this.getEntriesCount();
  }

  getEntriesCount(): void {
    this.isLoading.set(true); // Rozpoczynamy ładowanie
    console.log("To sie wywoluje ")
    this.vocabularyService.countEntry().subscribe({
      next: (count: number) => {
        // Zapisz zwróconą liczbę do sygnału
        this.totalEntriesCount.set(count); 
        this.isLoading.set(false); // Zakończ ładowanie
        console.log(`Liczba słów z backendu: ${count}`);
      },
      error: (err) => {
        console.error('Błąd podczas pobierania liczby wpisów z backendu:', err);
        this.isLoading.set(false); // Zakończ ładowanie (nawet z błędem)
        // Można tutaj ustawić totalEntriesCount na 0 lub pokazać komunikat błędu
      }
    });
  }

 generateWords(count: number): void {
      this.isGenerating.set(true);
      this.quizData.set(null);
      this.isCanceled.set(false);
      console.log(`[App] Rozpoczynanie generowania ${count} pytań...`);
      
      this.quizService.generateQuizQuestionsWithQuizUuid(count).pipe(
          tap((response: QuizDto) => {
             // W bloku tap ustawiamy dane quizu
             this.quizData.set(response);
             console.log(`[App] Quiz UUID: ${response.quizUuid}`);
          }),
          // Używamy catchError tylko do obsługi błędów strumienia bez crashu aplikacji
          catchError(err => {
              console.error('[App] Błąd w strumieniu RxJS podczas generowania quizu:', err);
              // Zwracamy Observable, aby utrzymać strumień przy życiu, ale nie kontynuować go do 'next'
              return of(null); 
          })
      ).subscribe({
          next: (response) => {
              // Zabezpieczenie: jeśli catchError zwrócił null, nie robimy nic w next
              if (response !== null) {
                  // POPRAWKA: Tutaj resetujemy isGenerating na false po sukcesie
                  this.isGenerating.set(false);
                  console.log("[App] Generowanie zakończone sukcesem.");
              }
          },
          error: (err) => {
              // Ten blok zostanie uruchomiony tylko, jeśli błąd nie został obsłużony przez catchError
              console.error('[App] Ostateczny błąd subskrypcji:', err); 
              this.isGenerating.set(false);
          },
          complete: () => {
              // Jeśli response był null z powodu błędu, musimy też zresetować isGenerating
              if (this.quizData() === null) {
                this.isGenerating.set(false);
              }
          }
      });
  }
  
  resetState(): void {
    console.log(this.isCanceled())
    this.quizData.set(null);
    this.isGenerating.set(false);
    this.isFinished.set(false);
    this.isCanceled.set(true);
  }

   handleQuizSaved(quizSaved: QuizViewDto): void {
        console.log(`APP: Otrzymano UUID z dziecka QuestionsComponent: ${quizSaved}`);
        this.latestQuizUuid.set(quizSaved.quizUuid);
    }

    handleQuizIsFinished(isFinished: boolean) {
      console.log("`APP: Otrzymano boolean z dziecka QuestionsComponent:" +isFinished)
      this.isFinished.set(isFinished);
    }

}
