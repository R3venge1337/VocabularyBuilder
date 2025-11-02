import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VocabularyEditDialogComponent } from './vocabulary-edit-dialog-component';

describe('VocabularyEditDialogComponent', () => {
  let component: VocabularyEditDialogComponent;
  let fixture: ComponentFixture<VocabularyEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VocabularyEditDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VocabularyEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
