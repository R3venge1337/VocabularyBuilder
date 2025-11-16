import { Component, computed, inject, OnInit, signal, ViewChild } from '@angular/core';
import { VocabularyService } from '../../services/vocabulary-service';
import { VocabularyEntryView } from '../../models/vocabularyEntryView';
import { PageDto } from '../../../../shared/models/pageDto';
import { CommonModule, DatePipe } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MasteryStatus } from '../../../../shared/enums/masterStatus';
import { PageableRequest } from '../../../../shared/models/pageableRequest';
import { FilterVocabularyEntryForm } from '../../models/filterVocabularyEntryForm';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule, Sort, SortDirection } from '@angular/material/sort';
import { ContextSource } from '../../../../shared/enums/contextSource';
import { PartOfSpeech } from '../../../../shared/enums/partOfSpeech';
import { MatIconModule } from "@angular/material/icon";
import { VocabularyDeleteDialogComponent } from '../vocabulary-delete-dialog-component/vocabulary-delete-dialog-component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { VocabularyEditDialogComponent } from '../vocabulary-edit-dialog-component/vocabulary-edit-dialog-component';

@Component({
  selector: 'app-vocabulary-table-component',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    DatePipe,
    MatSortModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIconModule,
    ToastrModule,
],
  templateUrl: './vocabulary-table-component.html',
  styleUrl: './vocabulary-table-component.scss'
})
export class VocabularyTableComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;
    private dialog = inject(MatDialog); 
  filterForm: FormGroup;
  constructor(private vocabularyService: VocabularyService,private fb: FormBuilder, private toastService: ToastrService){
   this.filterForm = this.fb.group({
      word: new FormControl<string>(''),
      masteryStatus: new FormControl<MasteryStatus | null>(null), 
      partOfSpeech: new FormControl<PartOfSpeech | null>(null),
      contextSource: new FormControl<ContextSource | null>(null)
  });
  }
  ngOnInit(): void {
   this.getAllEntries(this.getFilterValues(), this.pagination());
  }

    private selectFilterTrigger = signal(0); 

    pageData = signal<PageDto<VocabularyEntryView>>({
    pageNumber: 1,
    pageSize: 10,
    totalElements: 0,
    content: []
  });

    pagination = signal<PageableRequest>({
    page: 1,
    size: 10,
    sortField: 'createdAt',
    sortDirection: 'DESC'
  });

 private filters = computed<FilterVocabularyEntryForm>(() => {
    this.selectFilterTrigger(); 
    
    return {
        word: this.wordFilter(), 
        masteryStatus: this.filterForm.controls['masteryStatus'].value,
        partOfSpeech: this.filterForm.controls['partOfSpeech'].value,
        contextSource: this.filterForm.controls['contextSource'].value
    };
  });

 private wordFilter = signal<string>('');
  masteryStatusKeys = Object.keys(MasteryStatus).filter(key => isNaN(Number(key)));
  partOfSpeechKeys = Object.keys(PartOfSpeech).filter(key => isNaN(Number(key)));
  contextSourceKeys = Object.keys(ContextSource).filter(key => isNaN(Number(key)));

  isLoading = signal(false);

   displayedColumns: string[] = ['id', 'wordPhraseEn', 'translationPl', 'partOfSpeech','contextSource', 'masteryStatus', 'createdAt','actions'];

   matSortDirection = computed<SortDirection>(() => {
    const apiDirection = this.pagination().sortDirection;
    if (apiDirection === 'ASC') {
      return 'asc';
    }
    if (apiDirection === 'DESC') {
      return 'desc';
    }
    return '';
  });

   getAllEntries(filterForm: FilterVocabularyEntryForm, pageableRequest: PageableRequest): PageDto<VocabularyEntryView>{
     this.isLoading.set(true);
     this.vocabularyService.getEntries(filterForm,pageableRequest)
      .subscribe({
        next: (data: PageDto<VocabularyEntryView>) => {
          this.pageData.set(data);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error("Błąd ładowania słówek:", err);
          this.isLoading.set(false);
        }
      });
      return {pageNumber: this.pageData().pageNumber, pageSize: this.pageData().pageSize, content: this.pageData().content, totalElements:this.pageData().totalElements}
  }

  getBadgeClass(status: MasteryStatus): string {
    switch (status) {
      case MasteryStatus.TO_REVIEW: return 'badge-toReview';
      case MasteryStatus.LEARNING: return 'badge-learning';
      case MasteryStatus.MASTERED: return 'badge-mastered';
      default: return '';
    }
  }


handlePageEvent(event: PageEvent): void {
    const isPageSizeChanged = this.pagination().size !== event.pageSize;
    console.log(event)
    let newPageIndex = event.pageIndex;
    let newPageSize = event.pageSize;

    if (isPageSizeChanged) {
      newPageIndex = 0;
    }

    const pageForApi = newPageIndex + 1;

    this.pagination.update(currentPagination => ({
      ...currentPagination,
      page: pageForApi, 
      size: newPageSize,
    }));
   this.getAllEntries(this.filters(), this.pagination());
 }

handleSortChange(sort: Sort): void {
    const newSortField = sort.active || 'createdAt';
    const newSortDirection = sort.direction.toUpperCase(); 

    this.pagination.update(currentPagination => ({
        ...currentPagination,
        page: 1, 
        sortField: newSortField,
        sortDirection: newSortDirection
    }));

    this.getAllEntries(this.filters(), this.pagination()); 
  }

 applyFilters(): void {
    this.wordFilter.set(this.filterForm.controls['word'].value || '');

    this.pagination.update(p => ({...p, page: 1}));

    this.getAllEntries(this.filters(), this.pagination());
  }

   handleSelectFilterChange(): void {
     this.selectFilterTrigger.update(val => val + 1);
     this.pagination.update(p => ({...p, page: 1}));
     this.getAllEntries(this.filters(), this.pagination());
  }
  
  clearFilters(): void {
    this.filterForm.reset({
      word: '',
      masteryStatus: null, 
      partOfSpeech: null,
      contextSource: null
    });

    this.wordFilter.set('');
    
    this.selectFilterTrigger.update(val => val + 1);
    this.pagination.update(p => ({...p, page: 1}));
    this.getAllEntries(this.filters(), this.pagination());
  }

   private getFilterValues(): FilterVocabularyEntryForm {
    return this.filterForm.getRawValue() as FilterVocabularyEntryForm;
  }

   confirmAndDeleteWord(word: VocabularyEntryView): void {
    const dialogRef = this.dialog.open(VocabularyDeleteDialogComponent, {
      width: '380px',
      data: word 
    });

    dialogRef.afterClosed().subscribe((wasDeleted: boolean | undefined) => {
      if(wasDeleted === true) {
        this.toastService.success(`Słówko ID ${word.id} zostało trwale usunięte.`);
          this.refreshData();
      }else if (wasDeleted=== false) {
        this.toastService.info('Usuwanie anulowane lub nieudane.');
      }
    });
  }

  showEditDialog(word: VocabularyEntryView): void {
      const dialogRef = this.dialog.open(VocabularyEditDialogComponent, {
      width: '380px',
      data: word 
    });
    dialogRef.afterClosed().subscribe((wasEdited: boolean | undefined) => {
      if (wasEdited === true) {
        this.toastService.success(`Słówko ID ${word.id} zostało trwale.`);
        this.refreshData();
      } else if (wasEdited === false) {
        this.toastService.info('Usuwanie anulowane lub nieudane.');
      }
    });
  }

   public refreshData(newEntry?: VocabularyEntryView): void {
      // Jeśli otrzymaliśmy nowy wpis i jesteśmy na odpowiedniej stronie/sortowaniu, 
      // spróbuj zaktualizować listę lokalnie
      if (newEntry && this.pagination().page === 1 && this.pagination().sortField === 'createdAt' && this.pagination().sortDirection === 'DESC') {
          this.pageData.update(data => {
              const newContent = [newEntry, ...data.content];
              
              if (newContent.length > data.pageSize) {
                  newContent.pop(); 
              }
              
              return {
                  ...data,
                  content: newContent,
                  totalElements: data.totalElements + 1
              };
          });
      } else {
          // W przeciwnym razie wymuś pełne załadowanie danych z API
          this.getAllEntries(this.filters(), this.pagination());
      }
  }
}
