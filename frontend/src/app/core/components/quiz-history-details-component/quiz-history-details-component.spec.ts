import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizHistoryDetailsComponent } from './quiz-history-details-component';

describe('QuizHistoryDetailsComponent', () => {
  let component: QuizHistoryDetailsComponent;
  let fixture: ComponentFixture<QuizHistoryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizHistoryDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizHistoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
