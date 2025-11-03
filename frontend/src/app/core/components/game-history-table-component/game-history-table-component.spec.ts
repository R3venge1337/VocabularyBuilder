import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameHistoryTableComponent } from './game-history-table-component';

describe('GameHistoryTableComponent', () => {
  let component: GameHistoryTableComponent;
  let fixture: ComponentFixture<GameHistoryTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameHistoryTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameHistoryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
