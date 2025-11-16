import { Component, ViewChild } from '@angular/core';
import { VocabularyTableComponent } from '../../components/vocabulary-table-component/vocabulary-table-component';
import { VocabularyAddFormComponent } from "../../components/vocabulary-add-form-component/vocabulary-add-form-component";
import { VocabularyEntryView } from '../../models/vocabularyEntryView';

@Component({
  selector: 'app-vocabulary-page',
  imports: [VocabularyTableComponent, VocabularyAddFormComponent],
  templateUrl: './vocabulary-page.html',
  styleUrl: './vocabulary-page.scss'
})
export class VocabularyPage {

    @ViewChild('table') vocabularyTable!: VocabularyTableComponent;

  /**
   * Obsługuje zdarzenie emisji nowego słówka z komponentu dodawania.
   * Wywołuje metodę odświeżania w komponencie tabeli.
   */
  handleVocabularyAdded(newEntry: VocabularyEntryView): void {
    // Sprawdzamy, czy referencja do tabeli jest dostępna
    if (this.vocabularyTable) {
      // Wywołujemy publiczną metodę refreshData, przekazując nowe słówko.
      this.vocabularyTable.refreshData(newEntry);
    }
  }

}
