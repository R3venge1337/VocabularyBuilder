import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VocabularyDeleteDialogComponent } from './vocabulary-delete-dialog-component';

describe('VocabularyDeleteDialogComponent', () => {
  let component: VocabularyDeleteDialogComponent;
  let fixture: ComponentFixture<VocabularyDeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VocabularyDeleteDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VocabularyDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
