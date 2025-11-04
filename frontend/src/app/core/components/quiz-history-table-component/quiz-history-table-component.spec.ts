import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizHistoryTableComponent } from './quiz-history-table-component';

describe('QuizHistoryTableComponent', () => {
  let component: QuizHistoryTableComponent;
  let fixture: ComponentFixture<QuizHistoryTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizHistoryTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizHistoryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
