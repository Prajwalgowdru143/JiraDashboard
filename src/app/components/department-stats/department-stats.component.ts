import { Component, OnInit } from '@angular/core';
import { ContributionService } from '../../services/contribution.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterService } from '../../services/filter.service';

interface DepartmentStat {
  departmentName: string;
  totalIssues: number;
  totalIssuesDone: number;
  avgPerDeveloper: number | null;
  mostActiveDev: string;
}

@Component({
  selector: 'app-department-stats',
  standalone: true,
  imports: [CommonModule, FormsModule], // Added FormsModule for search input
  template: `<div class="p-6">
  <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
    Project Statistics
  </h2>

  <!-- Search Input -->
  <input 
    type="text" 
    [(ngModel)]="searchTerm"
    placeholder="Search by name..." 
    class="w-full p-2 mb-4 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
  />

  <div class="overflow-x-auto">
    <div class="max-h-[400px] overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="sticky top-0 bg-white dark:bg-gray-800 shadow-md">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Project
            </th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Contributions
            </th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Avg/Developer
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Top Contributor
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr *ngFor="let stat of filteredDepartmentStats" class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
              {{ stat.departmentName }}
            </td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-900 dark:text-white">
              {{ stat.totalIssues }} / {{ stat.totalIssuesDone }}
            </td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-900 dark:text-white">
              {{ stat.avgPerDeveloper !== null && stat.avgPerDeveloper !== undefined ? stat.avgPerDeveloper.toFixed(1) : 'N/A' }}
            </td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              {{ stat.mostActiveDev }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>`
})
export class DepartmentStatsComponent implements OnInit {
  departmentStats: DepartmentStat[] = [];
  searchTerm: string = '';

  constructor(private contributionService: ContributionService,
              private filterService: FilterService) { }

  ngOnInit() {
    this.filterService.projectKey$.subscribe((projectKey) => {
      this.loadDepartmentStats(projectKey);
    });

    this.loadDepartmentStats('');
  }

  private loadDepartmentStats(projectKey: string) {
    this.contributionService.getContributions(projectKey)
      .then((stats) => {
        this.filterService.updateContributors(stats);
        this.departmentStats = stats
          .map(stat => ({
            departmentName: stat.department,
            totalIssues: stat.totalIssues ?? 0,
            totalIssuesDone: stat.totalIssuesDone ?? 0,
            avgPerDeveloper: stat.totalIssues ? (stat.totalIssuesDone / stat.totalIssues) * 100 : 0,
            mostActiveDev: stat.user,
          }))
          .sort((a, b) => (b.totalIssuesDone ?? 0) - (a.totalIssuesDone ?? 0)); // Sort DESCENDING by totalIssuesDone
      })
      .catch((error) => console.error('Error loading department stats:', error));
  }

  // Computed property for filtering departments by name
  get filteredDepartmentStats(): DepartmentStat[] {
    return this.departmentStats.filter(stat => 
      stat.mostActiveDev.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
