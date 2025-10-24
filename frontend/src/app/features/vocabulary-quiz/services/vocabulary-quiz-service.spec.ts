import { TestBed } from '@angular/core/testing';

import { VocabularyQuizService } from './vocabulary-quiz-service';

describe('VocabularyQuizService', () => {
  let service: VocabularyQuizService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VocabularyQuizService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
