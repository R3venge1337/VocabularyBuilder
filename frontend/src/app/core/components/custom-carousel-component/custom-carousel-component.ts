import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { VocabularyService } from '../../../features/vocabulary-quiz/services/vocabulary-service';
import { VocabularyEntryView } from '../../../features/vocabulary-quiz/models/vocabularyEntryView';
import { lastValueFrom } from 'rxjs';
import { PageableRequest } from '../../../shared/models/pageableRequest';
import { FilterVocabularyEntryForm } from '../../../features/vocabulary-quiz/models/filterVocabularyEntryForm';
  
const PAGE_SIZE = 50;
const SLIDE_INTERVAL = 3000;

@Component({
  selector: 'app-custom-carousel-component',
  imports: [],
  templateUrl: './custom-carousel-component.html',
  styleUrl: './custom-carousel-component.scss'
})
export class CustomCarouselComponent implements OnInit,OnDestroy {
 private currentFilter: FilterVocabularyEntryForm = {
   word: '',
   masteryStatus: null,
   partOfSpeech: null,
   contextSource: null
 };
  // Stan aplikacji zarządzany przez sygnały
  public cards = signal<VocabularyEntryView[]>([]);
  public currentSlideIndex = signal<number>(0);
  public isLoading = signal<boolean>(true);
  public isFetchingNextChunk = signal<boolean>(false); 
  
  // Stan paginacji dla Postgresql (Page/Size)
  public totalWordCount = signal<number>(0); // Całkowita liczba słów w bazie
  public hasMoreCards = signal<boolean>(true); // Czy są jeszcze karty do pobrania
  private slideTimer: any;


   // Startuje interwał automatycznego przewijania
  private startTimer(): void {
    this.stopTimer(); // Upewnij się, że stary timer jest zatrzymany
    this.slideTimer = setInterval(() => {
        this.nextSlide(true); // Wymuś przewijanie, nawet jeśli doszliśmy do końca listy
    }, SLIDE_INTERVAL);
  }

  // Zatrzymuje interwał
  private stopTimer(): void {
    if (this.slideTimer) {
      clearInterval(this.slideTimer);
    }
  }

  // Resetuje interwał (wywoływane po ręcznej interakcji użytkownika)
  public resetTimer(): void {
    this.stopTimer();
    this.startTimer();
  }
  // Metoda do inicjalizacji i ładowania danych
  ngOnInit() {
    this.initAppAndLoadCards();
  }

  // Metoda do czyszczenia interwału (konieczna dla uniknięcia wycieków pamięci)
  ngOnDestroy(): void {
    this.stopTimer();
  }
 private async loadNextChunkFromApi(): Promise<void> {
    
    // Obliczamy, którą stronę chcemy pobrać. Numer strony jest liczony od 1.
    const pageToFetch = Math.floor(this.cards().length / PAGE_SIZE) + 1; 

    // Sprawdź, czy nie trwa już ładowanie i czy są jeszcze karty
    if (this.isFetchingNextChunk() || (!this.hasMoreCards() && pageToFetch > 1)) {
        return;
    }
    
    this.isFetchingNextChunk.set(true);

    const pageableRequest: PageableRequest = {
        page: pageToFetch,
        size: PAGE_SIZE,
        sortField: 'wordPhraseEn',
        sortDirection: 'ASC'
    };

    try {
        // Wywołanie metody z Serwisu i konwersja Observable na Promise
        const response$ = this.vocabularyService.getEntries(this.currentFilter, pageableRequest);
        const response = await lastValueFrom(response$); 
        
        // Dodanie nowych kart do istniejącej listy
        if (response.content.length > 0) {
            // response.content jest typu Card[], co jest zgodne z cards()
            this.cards.update(currentCards => [...currentCards, ...response.content]);
        }

        // Aktualizacja stanów
        this.totalWordCount.set(response.totalElements);
        // HasMoreCards jest true, jeśli nie osiągnęliśmy ostatniej strony
        this.hasMoreCards.set(response.content.length === PAGE_SIZE); 

    } catch (error) {
        console.error("Błąd pobierania danych z API (PostgreSQL):", error);
        // W przypadku błędu, zakładamy, że na razie nie ma więcej kart
        this.hasMoreCards.set(false); 
    } finally {
        this.isFetchingNextChunk.set(false);
    }
  }

  constructor(private vocabularyService: VocabularyService) {

  }

    // Metoda do pobierania URL obrazu z logiką zastępczą
  public getImageUrl(card: VocabularyEntryView): string {
    const PLACEHOLDER_URL = 'https://placehold.co/400x200/475569/f8fafc?text=BRAK+OBRAZU';
    
    return card.imageUrl || PLACEHOLDER_URL;
  }

   public nextSlide(autoAdvance: boolean = false): void {
    const nextIndex = this.currentSlideIndex() + 1;
    const currentCardsCount = this.cards().length;

    // 1. Obsługa końca listy / Zawijanie (tylko w trybie autoAdvance)
    if (nextIndex >= currentCardsCount) {
        if (autoAdvance) {
            this.currentSlideIndex.set(0); // Zawijanie do pierwszej karty
            return;
        } else {
            return; // Ręczne kliknięcie zatrzymuje się na ostatniej
        }
    }

    // 2. Ładowanie kolejnej partii (zapewnienie bufora)
    const BUFFOR_SIZE = 10;
    if (nextIndex >= currentCardsCount - BUFFOR_SIZE && this.hasMoreCards()) {
        this.loadNextChunkFromApi();
    }
    
    // 3. Przewinięcie
    this.currentSlideIndex.set(nextIndex);
  }

  // Przejście do poprzedniej fiszki
  public previousSlide(): void {
    this.currentSlideIndex.update(index => 
      Math.max(index - 1, 0)
    );
  }

  // Bezpośrednie przejście do slajdu
  public goToSlide(index: number): void {
    this.currentSlideIndex.set(index);
    // Upewnij się, że ładowanie jest wywołane, jeśli użytkownik kliknie na slajd blisko końca
    const currentCardsCount = this.cards().length;
    const BUFFOR_SIZE = 10;

    if (index >= currentCardsCount - BUFFOR_SIZE) {
        this.loadNextChunkFromApi();
    }
  }

    private async initAppAndLoadCards(): Promise<void> {
    this.isLoading.set(true);
    
    // Ładowanie pierwszej partii danych (page 1)
    await this.loadNextChunkFromApi();
        
    this.currentSlideIndex.set(0); 
    this.isLoading.set(false);
  }

}
