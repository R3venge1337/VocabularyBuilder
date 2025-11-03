import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize, take } from 'rxjs';
import { ContextSource } from '../../../../shared/enums/contextSource';
import { PartOfSpeech } from '../../../../shared/enums/partOfSpeech';
import { CreateVocabularyEntryForm } from '../../models/createVocabularyEntryForm';
import { VocabularyEntryView } from '../../models/vocabularyEntryView';
import { VocabularyService } from '../../services/vocabulary-service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { createUrlValidator } from '../../../../shared/validators/urlValidator';

@Component({
  selector: 'app-vocabulary-add-form-component',
  imports: [
      CommonModule, 
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    ToastrModule
  ],
  templateUrl: './vocabulary-add-form-component.html',
  styleUrl: './vocabulary-add-form-component.scss'
})
export class VocabularyAddFormComponent {
 isFormVisible = signal(false);
  constructor(private vocabularyService: VocabularyService, private toastService: ToastrService) {}
  protected partOfSpeechKeys = Object.values(PartOfSpeech);
  protected contextSourceKeys = Object.values(ContextSource);
  protected PartOfSpeech = PartOfSpeech; 
  protected ContextSource = ContextSource; 

  isLoading = signal(false);

  @Output() vocabularyAdded = new EventEmitter<VocabularyEntryView>();

  private fb = inject(FormBuilder);

  vocabularyForm: FormGroup = this.fb.group({
    wordPhraseEn: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    translationPl: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    partOfSpeech: [null as PartOfSpeech | null, [Validators.required]],
    contextSource: [null as ContextSource | null, [Validators.required]],
    
    sourceTitle: [null, [Validators.maxLength(150)]], 
    episodeNumber: [null as number | null, [Validators.min(1)]], 
    timeOffsetSeconds: [null as number | null, [Validators.min(0)]], 
    imageUrl :  [null, [Validators.maxLength(1024), createUrlValidator()]]

  });

   toggleForm(): void {
    this.isFormVisible.update(visible => !visible);
  }

  public onSubmit(): void {
    if (this.vocabularyForm.invalid) {
      this.vocabularyForm.markAllAsTouched();
      this.toastService.error('Proszę wypełnić wszystkie wymagane pola poprawnie.');
      return;
    }

    this.isLoading.set(true); 

    const newEntryForm: CreateVocabularyEntryForm = this.vocabularyForm.value as CreateVocabularyEntryForm;
    newEntryForm.wordPhraseEn = newEntryForm.wordPhraseEn.toLowerCase().trim();
    newEntryForm.translationPl = newEntryForm.translationPl.toLocaleLowerCase().trim();
    this.vocabularyService.createEntry(newEntryForm).pipe(
      take(1),
      finalize(()=> {
        this.isLoading.set(false);
      })
    ).subscribe({
      next: (entryView: VocabularyEntryView) => {
        this.vocabularyAdded.emit(entryView); 
        this.toastService.success(`Słówko "${entryView.wordPhraseEn}" dodane pomyślnie!`);
        this.resetForm();
        this.toggleForm();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Błąd podczas dodawania słówka:', error);
        this.toastService.error(error.error.message);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  public resetForm(): void {
    this.vocabularyForm.reset({
      wordPhraseEn: '', 
      translationPl: '', 
      contextExample: '',
      sourceTitle: null,
      episodeNumber: null,
      timeOffsetSeconds: null,
      partOfSpeech: null, 
      contextSource: null,
      imageUrl: null
    });
    this.vocabularyForm.markAsPristine(); 
    this.vocabularyForm.markAsUntouched(); 
  }

}
