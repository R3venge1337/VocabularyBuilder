import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VocabularyQuizSummaryComponent } from './vocabulary-quiz-summary-component';

describe('VocabularyQuizSummaryComponent', () => {
  let component: VocabularyQuizSummaryComponent;
  let fixture: ComponentFixture<VocabularyQuizSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VocabularyQuizSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VocabularyQuizSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
