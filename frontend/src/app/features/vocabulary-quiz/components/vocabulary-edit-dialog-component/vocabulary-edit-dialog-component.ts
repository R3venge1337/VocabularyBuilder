import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { VocabularyEntryView } from '../../models/vocabularyEntryView';
import { PartOfSpeech } from '../../../../shared/enums/partOfSpeech';
import { ContextSource } from '../../../../shared/enums/contextSource';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { VocabularyService } from '../../services/vocabulary-service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';

@Component({
  selector: 'app-vocabulary-edit-dialog-component',
  imports: [
     MatProgressSpinnerModule,  
      CommonModule, 
      MatDialogModule, 
      MatButtonModule, 
      MatIconModule, 
      MatProgressSpinnerModule,
      ToastrModule,
  ],
  templateUrl: './vocabulary-edit-dialog-component.html',
  styleUrl: './vocabulary-edit-dialog-component.scss'
})
export class VocabularyEditDialogComponent {
   dialogRef = inject(MatDialogRef<VocabularyEditDialogComponent>);
    data: VocabularyEntryView = inject(MAT_DIALOG_DATA);
    currentEditEntry: WritableSignal<VocabularyEntryView | null> = signal(this.data);
    partOfSpeechOptions = computed(() => Object.entries(PartOfSpeech));
    contextSourceOptions = computed(() => Object.entries(ContextSource));


     constructor(private vocabularyService: VocabularyService, private toastService: ToastrService){}

  isProcessing = signal(false);
  error = signal<any>(null);
  deleteStatus = signal<'success' | 'failure' | null>(null);


  openEditDialog(entry: VocabularyEntryView) {
        this.currentEditEntry.set({ ...entry });
    }

    closeEditDialog(target?: EventTarget | null) {
        const entry = this.currentEditEntry();
        if (entry) {
             this.dialogRef.close(true);
        }
        this.currentEditEntry.set(null); 
    }
   
    async saveEdit(event: Event): Promise<void> {
      event.preventDefault()
        const editedEntry = this.currentEditEntry();
        if (!editedEntry) return;

        if (!editedEntry.wordPhraseEn.trim() || !editedEntry.translationPl.trim() || !editedEntry.partOfSpeech || !editedEntry.contextSource) {
            console.error("Błąd: Wymagane pola są puste.");
            return;
        }
        try {
       await firstValueFrom(this.vocabularyService.updateEntry(editedEntry.id, editedEntry))
      
      this.deleteStatus.set('success');
      this.toastService.success(`Słówko ID ${this.data.id} zostało trwale zmienione`)
    } catch (err) {
      console.error("Błąd podczas update:", err);
      this.error.set(err); 
      this.toastService.error("Nie udało się zaktualizować słowa" )
      this.deleteStatus.set('failure'); 
    } finally {
      this.isProcessing.set(false); 
    }
      this.closeEditDialog();
    }
   
    updateEditField<K extends keyof VocabularyEntryView>(field: K, value: any): void {
        this.currentEditEntry.update(entry => {
            if (!entry) return null;
            
            let processedValue = value;

            if (field === 'episodeNumber' || field === 'timeOffsetSeconds') {
                const num = parseInt(value, 10);
                processedValue = isNaN(num) || num <= 0 ? null : num;
            } else if (typeof processedValue === 'string') {
                processedValue = processedValue.trim();
            }

            return { ...entry, [field]: processedValue as any };
        });
    }

}
