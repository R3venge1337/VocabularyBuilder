import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VocabluaryQuizPage } from './vocabluary-quiz-page';

describe('VocabluaryQuizPage', () => {
  let component: VocabluaryQuizPage;
  let fixture: ComponentFixture<VocabluaryQuizPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VocabluaryQuizPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VocabluaryQuizPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
