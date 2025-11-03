import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameHistoryDetailsComponent } from './game-history-details-component';

describe('GameHistoryDetailsComponent', () => {
  let component: GameHistoryDetailsComponent;
  let fixture: ComponentFixture<GameHistoryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameHistoryDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameHistoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
