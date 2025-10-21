import { Component } from '@angular/core';
import { VocabularyTableComponent } from '../../components/vocabulary-table-component/vocabulary-table-component';
import { VocabularyAddFormComponent } from "../../components/vocabulary-add-form-component/vocabulary-add-form-component";

@Component({
  selector: 'app-vocabulary-page',
  imports: [VocabularyTableComponent, VocabularyAddFormComponent],
  templateUrl: './vocabulary-page.html',
  styleUrl: './vocabulary-page.scss'
})
export class VocabularyPage {

}
