import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VocabularyQuizInfoComponent } from './vocabulary-quiz-info-component';

describe('VocabularyQuizInfoComponent', () => {
  let component: VocabularyQuizInfoComponent;
  let fixture: ComponentFixture<VocabularyQuizInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VocabularyQuizInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VocabularyQuizInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
