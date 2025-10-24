import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VocabularyQuizQuestionsComponent } from './vocabulary-quiz-questions-component';

describe('VocabularyQuizQuestionsComponent', () => {
  let component: VocabularyQuizQuestionsComponent;
  let fixture: ComponentFixture<VocabularyQuizQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VocabularyQuizQuestionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VocabularyQuizQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
