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
import { HttpErrorResponse } from '@angular/common/http';
import { E } from '@angular/cdk/keycodes';

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
  editStatus = signal<'success' | 'failure' | null>(null);


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
        console.log(editedEntry)
        if (!editedEntry) return;

        if (!editedEntry.wordPhraseEn.trim() || !editedEntry.translationPl.trim() || !editedEntry.partOfSpeech || !editedEntry.contextSource) {
            console.error("Błąd: Wymagane pola są puste.");
            this.toastService.error("Błąd: Wymagane pola są puste.")
            return;
        }
        try {
       await firstValueFrom(this.vocabularyService.updateEntry(editedEntry.id, editedEntry))
      
      this.editStatus.set('success');
    } catch (err: any) {
      console.error("Błąd podczas update:", err);
      this.error.set(err); 
      this.toastService.error(err.error.message)
      this.editStatus.set('failure'); 
    } finally {
      this.isProcessing.set(false); 
    }
      this.closeEditDialog();
    }
   
    updateEditField<K extends keyof VocabularyEntryView>(field: K, value: any): void {
      console.log(this.currentEditEntry())
        this.currentEditEntry.update(entry => {
            if (!entry) return null;
            
            let processedValue = value;

            if(field === 'sourceTitle' && value == ""){
          processedValue = null
            }

            if (field === 'episodeNumber' || field === 'timeOffsetSeconds') {
                const num = parseInt(value, 10);
                processedValue = isNaN(num) || num <= 0 ? null : num;
            } else if (typeof processedValue === 'string') {
                processedValue = processedValue.trim();
            } else if (typeof value === 'string' && (field === 'partOfSpeech' || field === 'contextSource')) {
                // Logic for enum selection (value is the string key of the enum)
                processedValue = value as any;
            }

            return { ...entry, [field]: processedValue as any };
        });
    }

      getSelectValue(event: Event): string {
        console.log(event)
    return (event.target as HTMLSelectElement).value;
  }

}
