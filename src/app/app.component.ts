// app.component.ts
import { Component } from '@angular/core';
import { DashboardFiltersComponent } from './components/dashboard-filters/dashboard-filters/dashboard-filters.component';
import { ContributionHeatmapComponent } from './components/contribution-heatmap/contribution-heatmap/contribution-heatmap.component';
import { DepartmentStatsComponent } from './components/department-stats/department-stats.component';
import { ContributorLeaderboardComponent } from './components/contributor-leaderboard/contributor-leaderboard.component';
import { ProjectOverviewComponent } from './components/project-overview/project-overview.component';
// import { TrendsComponent } from './components/trends/trends.component';

@Component({
  selector: 'app-root',
  imports: [DashboardFiltersComponent,
    ContributionHeatmapComponent,
    DepartmentStatsComponent,
    ContributorLeaderboardComponent,
    ProjectOverviewComponent,],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <!-- Header -->
      <header class="bg-white dark:bg-gray-800 shadow">
        <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              Company Contributions Dashboard
            </h1>
            
            <!-- Header Controls -->
            
            <!--  <div class="flex space-x-4">
              <button class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                Export
              </button>
              <button class="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                Settings
              </button>
            </div> -->
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <!-- Filters -->
        <div class="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <app-dashboard-filters></app-dashboard-filters>
        </div>

        <!-- Dashboard Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Heatmap Section -->
          <div class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow">
            <app-contribution-heatmap></app-contribution-heatmap>
          </div>

          <!-- Department Stats -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
            <app-department-stats></app-department-stats>
          </div>

          <!-- Contributor Leaderboard -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
            <app-contributor-leaderboard></app-contributor-leaderboard>
          </div>

         

         
        </div>
         <!-- Project Overview -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <app-project-overview></app-project-overview> 
          </div>
      </main>
    </div>
  `
})
export class AppComponent {
  title = 'contribution-dashboard';
}