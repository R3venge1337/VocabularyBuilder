import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VocabularyAddFormComponent } from './vocabulary-add-form-component';

describe('VocabularyAddFormComponent', () => {
  let component: VocabularyAddFormComponent;
  let fixture: ComponentFixture<VocabularyAddFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VocabularyAddFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VocabularyAddFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
