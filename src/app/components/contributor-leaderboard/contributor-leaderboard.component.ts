import { Component, OnInit } from '@angular/core';
import { ContributionService } from '../../services/contribution.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterService } from '../../services/filter.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroFireSolid } from '@ng-icons/heroicons/solid';

interface Contributor {
  id: number;
  name: string;
  contributions: number | null;
  streak: number | null;
  department: string;
  avatar: string;
}

@Component({
  selector: 'app-contributor-leaderboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIcon],
  viewProviders: [provideIcons({ heroFireSolid })], 
  template: `<div class="p-6">
  <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
    Top Contributors
  </h2>

  <!-- Search Input -->
  <input 
    type="text" 
    [(ngModel)]="searchTerm"
    placeholder="Search by name..." 
    class="w-full p-2 mb-4 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
  />

  <div class="max-h-[400px] overflow-y-auto space-y-4 border border-gray-200 dark:border-gray-700 rounded-lg p-2">
    <div *ngFor="let contributor of filteredContributors; let i = index" 
         class="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      
      <!-- Rank -->
      <div class="flex-shrink-0 w-8 text-2xl font-bold text-gray-400 dark:text-gray-500">
        {{ i + 1 }}
      </div>
      
      <!-- Avatar & Name -->
      <div class="flex-shrink-0">
        <img [src]="contributor.avatar || 'assets/default-avatar.png'" 
             [alt]="contributor.name || 'Unknown Contributor'"
             class="w-10 h-10 rounded-full">
      </div>
      
      <div class="ml-4 flex-1">
        <div class="font-medium text-gray-900 dark:text-white">
          {{ contributor.name || 'Unknown' }}
        </div>
        <div class="text-sm text-gray-500 dark:text-gray-400">
          {{ contributor.department || 'N/A' }}
        </div>
      </div>
      
      <!-- Stats -->
      <div class="ml-4 text-right">
        <div class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ contributor.contributions !== null && contributor.contributions !== undefined ? contributor.contributions.toLocaleString() : '0' }}
        </div>
        <div class="text-sm flex items-center text-gray-500 dark:text-gray-400">
       <ng-icon name="heroFireSolid" color="red"/>streak: {{ contributor.streak?.toFixed(2) }}%
        </div>
      </div>
    </div>
  </div>
</div>`
})
export class ContributorLeaderboardComponent implements OnInit {
  topContributors: Contributor[] = [];
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
        this.topContributors = stats
          .map(stat => ({
            id: 1,
            name: stat.user,
            contributions: stat.totalIssuesDone,
            streak: stat.totalIssuesDone ? (stat.totalIssuesDone / stat.totalIssues) * 100 : 0, 
            department: stat.department, 
            avatar: stat.avatar,
          }))
          .sort((a, b) => (b.streak ?? 0) - (a.streak ?? 0)); // Sort DESCENDING by streak
      })
      .catch((error) => console.error('Error loading department stats:', error));
  }

  // Computed property for filtering based on search input
  get filteredContributors(): Contributor[] {
    return this.topContributors.filter(contributor => 
      contributor.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
