import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TictactoePage } from './tictactoe-page';

describe('TictactoePage', () => {
  let component: TictactoePage;
  let fixture: ComponentFixture<TictactoePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TictactoePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TictactoePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
