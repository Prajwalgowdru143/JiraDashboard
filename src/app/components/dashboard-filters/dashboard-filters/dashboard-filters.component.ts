import { Component, Output, EventEmitter, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContributionService } from '../../../services/contribution.service';
import { FilterService } from '../../../services/filter.service';

interface FilterState {
  dateRange: string;
  department: string;
  contributionType: string;
}

@Component({
  selector: 'app-dashboard-filters',
  standalone: true,
  imports: [CommonModule, FormsModule], //  Include FormsModule here
  template: `
    <div class="flex flex-col sm:flex-row gap-4">
      <!-- Date Range Filter -->
      <div class="flex-1">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Date Range
        </label>
        <select 
          [(ngModel)]="filters.dateRange"
          (change)="onFiltersChange()"
          class="w-full rounded-md border-gray-300 p-2.5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 3 months</option>
          <option value="365">Last year</option>
          <option value="custom">Custom range</option>
        </select>
      </div>

      <!-- Department Filter -->
      <div class="flex-1">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Projects
        </label>
        <select 
  [(ngModel)]="filters.department"
  (change)="onFiltersChange()"
  class="w-full rounded-md border-gray-300 shadow-sm p-2.5 focus:border-indigo-500 focus:ring-indigo-500">
  <option value="all">All Projects</option>
  <option *ngFor="let dept of departments; trackBy: trackById" [value]="dept.id">
    {{ dept.name }}
  </option>
</select>
      </div>

      <!-- Contribution Type Filter -->
      <div class="flex-1">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Contribution Type
        </label>
        <select 
          [(ngModel)]="filters.contributionType"
          (change)="onFiltersChange()"
          class="w-full rounded-md border-gray-300 shadow-sm p-2.5 focus:border-indigo-500 focus:ring-indigo-500">
          <option value="issues">Issues</option>
        </select>
      </div>

      <!-- Apply Filters Button -->
      <div class="flex items-end">
        <button 
          (click)="onFiltersChange()"
          class="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
          Apply Filters
        </button>
      </div>
    </div>
  `
})
export class DashboardFiltersComponent implements OnInit {
  @Output() filtersChanged = new EventEmitter<FilterState>();
  @Input() departments: { id: string, name: string }[] = [];

  constructor(private contributionService: ContributionService,
    private filterService: FilterService, private cdr: ChangeDetectorRef
  ) { }

  trackById(index: number, dept: { id: string; name: string }) {
    return dept.id;
  }

  ngOnInit() {
    this.filterService.departments$.subscribe(departments => {
      if (departments.length > 0) {  //  Only update if valid
        console.log(" Received Updated Departments:", departments);
        this.departments = departments;
      }
    });
  }
  ngOnChanges() {
    console.log("🔥 Departments Updated in Filter Component:", this.departments);
    this.cdr.detectChanges(); // Force change detection
  }

  filters: FilterState = {
    dateRange: '30',
    department: 'all',
    contributionType: 'issues'
  };




  // ngOnInit() {
  // this.contributionService.getDepartmentStats().subscribe({
  //   next: (departments) => {
  //     this.departments = departments;
  //   },
  //   error: (err) => {
  //     console.error('Failed to fetch departments:', err);
  //     this.departments = []; // Prevent UI from breaking
  //   }
  // });
  // }

  async onFiltersChange() {
    this.filtersChanged.emit(this.filters);

    // **Update shared service with new project key**


    const projectKey = this.filters.department !== 'all' ? this.filters.department : ''; // Map department to projectKey
    this.filterService.updateProjectKey(projectKey);
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(this.filters.dateRange, 10));

    try {
      const response = await this.contributionService.getFilterData(
        projectKey,
        startDate.toISOString().split("T")[0],
        endDate.toISOString().split("T")[0]
      );
      console.log('Filtered contributions:', response);
    } catch (error) {
      console.error('Error fetching filtered data:', error);
    }
  }
}
