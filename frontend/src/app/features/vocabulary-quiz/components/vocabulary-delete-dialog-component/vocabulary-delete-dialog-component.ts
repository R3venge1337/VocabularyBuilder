import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { VocabularyService } from '../../services/vocabulary-service';
import { VocabularyEntryView } from '../../models/vocabularyEntryView';
import { firstValueFrom } from 'rxjs';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-vocabulary-delete-dialog-component',
  imports: [
      MatProgressSpinnerModule,  
      CommonModule, 
      MatDialogModule, 
      MatButtonModule, 
      MatIconModule, 
      MatProgressSpinnerModule,
      ToastrModule,
    ],
  templateUrl: './vocabulary-delete-dialog-component.html',
  styleUrl: './vocabulary-delete-dialog-component.scss'
})
export class VocabularyDeleteDialogComponent {
   dialogRef = inject(MatDialogRef<VocabularyDeleteDialogComponent>);
  data: VocabularyEntryView = inject(MAT_DIALOG_DATA);
 constructor(private vocabularyService: VocabularyService, private toastService: ToastrService){
   // 1. Używamy 'effect' tylko do efektu ubocznego, czyli zamknięcia dialogu.
    effect(() => {
      const status = this.deleteStatus();
      
      if (status === 'success') {
        console.log(`[EFFECT] Pomyślnie usunięto ID: ${this.data.id}`);
        this.dialogRef.close(true); // Zwraca true w przypadku sukcesu
      } 
      
      // Jeśli status to 'failure', pozostawiamy dialog otwarty i wyświetlamy błąd()
    });
 }

   // Sygnały stanu
  isProcessing = signal(false);
  error = signal<any>(null);

  // Sygnał, którego użyjemy do wywołania efektu ubocznego (tylko w celu zamknięcia dialogu)
  // Wartość: false (niepowodzenie/anulowanie), true (sukces), null (początkowy)
  deleteStatus = signal<'success' | 'failure' | null>(null);
  /**
   * Obsługa usuwania za pomocą minimalnego async/await i aktualizacji sygnałów.
   */
  async confirmDelete(): Promise<void> {
    if (this.isProcessing()) return;

    this.isProcessing.set(true); // START: Ustawiamy stan ładowania
    this.error.set(null);       // Czyścimy błąd

    try {
      // firstValueFrom to minimalne użycie RxJS do 'rozpakowania' Observable
      await firstValueFrom(this.vocabularyService.deleteEntry(this.data.id));
      
      // Sukces: Ustawiamy sygnał deleteStatus, który wywoła 'effect' i zamknie dialog
      this.deleteStatus.set('success');
      this.toastService.success(`Słówko ID ${this.data.id} zostało trwale usunięte.`)

    } catch (err) {
      console.error("Błąd podczas usuwania:", err);
      this.error.set(err); // BŁĄD: Ustawiamy sygnał błędu
      this.toastService.error("Nie udało się usunąć tego słowa")
      this.deleteStatus.set('failure'); // BŁĄD: W effect ignorujemy 'failure'
    } finally {
      this.isProcessing.set(false); // KONIEC: Wyłączamy stan ładowania
    }
  }
}
