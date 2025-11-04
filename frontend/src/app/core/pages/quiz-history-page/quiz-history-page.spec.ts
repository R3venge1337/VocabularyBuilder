import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizHistoryPage } from './quiz-history-page';

describe('QuizHistoryPage', () => {
  let component: QuizHistoryPage;
  let fixture: ComponentFixture<QuizHistoryPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizHistoryPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
