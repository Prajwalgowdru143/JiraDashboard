import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartmentStatsComponent } from './components/department-stats/department-stats.component';
import { ContributorLeaderboardComponent } from './components/contributor-leaderboard/contributor-leaderboard.component';
import { ProjectOverviewComponent } from './components/project-overview/project-overview.component';
import { ModalComponent } from './components/modal/modal.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroCog8ToothMini } from '@ng-icons/heroicons/mini';
import { DashboardFiltersComponent } from './components/dashboard-filters/dashboard-filters/dashboard-filters.component';
import { ContributionHeatmapComponent } from './components/contribution-heatmap/contribution-heatmap/contribution-heatmap.component';
import { FilterService } from './services/filter.service';
import { ContributionService } from './services/contribution.service';
import { RadialbarComponent } from './components/radialbar/radialbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    DashboardFiltersComponent,
    ContributionHeatmapComponent,
    DepartmentStatsComponent,
    ContributorLeaderboardComponent,
    ProjectOverviewComponent,
    RadialbarComponent,
    ModalComponent,
    NgIcon
  ],
  viewProviders: [provideIcons({ heroCog8ToothMini })], 
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header class="bg-white dark:bg-gray-800 shadow">
        <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              Company Contributions Dashboard
            </h1>
            <div class="flex space-x-4">
              <button class="px-4 py-2 bg-gray-600 dark:bg-gray-700 rounded-md hover:bg-gray-500 dark:hover:bg-gray-600 transition-colors"
                (click)="openModal()">
                <ng-icon name="heroCog8ToothMini" color="white"/>
              </button>
            </div> 
          </div>
        </div>
      </header>
<!-- *ngIf="departments.length > 0" -->
      <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div class="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <app-dashboard-filters
  
  [departments]="departments"
  (filtersChanged)="applyFilters($event)">
</app-dashboard-filters>

        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow">
            <app-contribution-heatmap></app-contribution-heatmap>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
            <app-department-stats></app-department-stats>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
            <app-contributor-leaderboard></app-contributor-leaderboard>
          </div>
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <app-project-overview></app-project-overview> 
        </div>
         <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <app-radialbar></app-radialbar> 
        </div>
        </div>

      
      </main>

      <!-- Modal -->
      <app-modal *ngIf="isModalOpen" (close)="closeModal()" (submit)="handleSubmit($event)"></app-modal>
    </div>
  `
})
export class AppComponent {
  title = 'contribution-dashboard';
  isModalOpen = false;
  departments: { id: string, name: string }[] = [];

  constructor(
    private contributionService: ContributionService,
    private filterService: FilterService
  ) {}

  openModal() {
    console.log("Modal Opened");
    this.isModalOpen = true;
  }

  closeModal() {
    console.log("Modal Closed");
    this.isModalOpen = false;
  }

  handleSubmit(data: { email: string; apiToken: string }) {
    this.filterService.updateUserDetails(data);
  
    this.contributionService.getDepartmentStats().subscribe({
      next: (departments) => {
        console.log(" Fetched Departments:", departments);
  
        if (departments.length > 0) {  //  Only update if departments exist
          this.departments = departments.map(dept => ({
            id: dept.id,
            name: dept.name
          }));
  
          console.log(" Transformed Departments Sent to Filter Component:", this.departments);
          this.filterService.updateDepartments(this.departments); 
          this.filterService.updateUserDetails(data);//  Update the shared service
        }
      },
      error: (err) => {
        console.error(' Failed to fetch departments:', err);
        this.departments = [];
      }
    });
  
    this.isModalOpen = false;
  }
  
  applyFilters(filters: { dateRange: string; department: string; contributionType: string }) {
    console.log(" Filters Applied:", filters);

    // Update filter service
    this.filterService.updateProjectKey(filters.department !== 'all' ? filters.department : '');

    // Fetch data using new filters
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(filters.dateRange, 10));

    this.contributionService.getFilterData(
      filters.department !== 'all' ? filters.department : '',
      startDate.toISOString().split("T")[0],
      endDate.toISOString().split("T")[0]
    ).then(response => {
      console.log(' Filtered contributions:', response);
    }).catch(error => {
      console.error(' Error fetching filtered data:', error);
    });
  }
}


