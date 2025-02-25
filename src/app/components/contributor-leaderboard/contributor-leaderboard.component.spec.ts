import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorLeaderboardComponent } from './contributor-leaderboard.component';

describe('ContributorLeaderboardComponent', () => {
  let component: ContributorLeaderboardComponent;
  let fixture: ComponentFixture<ContributorLeaderboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContributorLeaderboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContributorLeaderboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
