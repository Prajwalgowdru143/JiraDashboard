import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentStatsComponent } from './department-stats.component';

describe('DepartmentStatsComponent', () => {
  let component: DepartmentStatsComponent;
  let fixture: ComponentFixture<DepartmentStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentStatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
