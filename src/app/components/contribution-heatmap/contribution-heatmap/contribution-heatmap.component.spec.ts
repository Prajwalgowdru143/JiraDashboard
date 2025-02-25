import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributionHeatmapComponent } from './contribution-heatmap.component';

describe('ContributionHeatmapComponent', () => {
  let component: ContributionHeatmapComponent;
  let fixture: ComponentFixture<ContributionHeatmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContributionHeatmapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContributionHeatmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
