import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ContributionService } from '../../services/contribution.service';

interface TrendData {
  date: string;
  commits: number;
  pullRequests: number;
  issues: number;
}

@Component({
  selector: 'app-trends',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, NgxChartsModule], // Ensure NgxChartsModule is included
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Fix for 'ngx-charts-line-chart' error
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          Contribution Trends
        </h2>

        <!-- Trend Type Selector -->
        <div class="flex space-x-2">
         <button *ngFor="let type of trendTypes"
        (click)="selectTrendType(type)"
        [class]="getTrendTypeClass(type)">
  {{ type }}
</button>
        </div>
      </div>

      <!-- Chart Container -->
      <div class="h-[300px] relative">
        <div *ngIf="loading" class="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-800/50">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>

        <ngx-charts-line-chart
          [view]="[200, 96]"
          [results]="chartData"
          [xAxis]="true"
          [yAxis]="true"
          [showLegend]="false"
          [showXAxisLabel]="true"
          [showYAxisLabel]="true"
          xAxisLabel="Date"
          yAxisLabel="Contributions"
          [autoScale]="true">
        </ngx-charts-line-chart>
      </div>

      <!-- Insights Section -->
      <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div *ngFor="let insight of insights" class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div class="text-sm text-gray-500 dark:text-gray-400">
            {{ insight.label }}
          </div>
          <div class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ insight.value }}
          </div>
          <div class="text-sm" [class]="getTrendClass(insight.trend)">
            {{ insight.trend > 0 ? '↑' : '↓' }} {{ Math.abs(insight.trend) }}%
          </div>
        </div>
      </div>
    </div>
  `
})
export class TrendsComponent implements OnInit {
  trendTypes = ['commits', 'pullRequests', 'issues'];
  selectedTrendType: keyof TrendData = 'commits'; // Fix type issue
  trendData: TrendData[] = [];
  chartData: any[] = [];
  loading = false;
  insights: { label: string; value: number; trend: number }[] = [];
  Math = Math; // To use Math functions in template

  constructor(private contributionService: ContributionService) { }

  ngOnInit() {
    this.loadTrendData();
  }

  selectTrendType(type: string) {
    const typedType = type as keyof TrendData;
    this.loadTrendData();
  }
  private loadTrendData() {
    this.loading = true;
    // this.contributionService.getTrendData(this.selectedTrendType)
    //   .subscribe({
    //     next: (data) => {
    //       this.trendData = data;
    //       this.formatChartData();
    //       this.calculateInsights();
    //       this.loading = false;
    //     },
    //     error: (error) => {
    //       console.error('Error loading trend data:', error);
    //       this.loading = false;
    //     }
    //   });
  }

  private formatChartData() {
    this.chartData = [
      {
        name: this.selectedTrendType,
        series: this.trendData.map(item => ({
          name: item.date,
          value: item[this.selectedTrendType as keyof TrendData] // Type Assertion Fix
        }))
      }
    ];
  }

  getTrendTypeClass(type: string): string {
    const baseClasses = 'px-3 py-1 rounded-md text-sm font-medium transition-colors';
    return type === this.selectedTrendType
      ? `${baseClasses} bg-indigo-600 text-white`
      : `${baseClasses} text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700`;
  }

  getTrendClass(trend: number): string {
    return trend > 0
      ? 'text-green-600 dark:text-green-400'
      : 'text-red-600 dark:text-red-400';
  }

  private calculateInsights() {
    if (this.trendData.length < 2) return;

    const latest = this.trendData[this.trendData.length - 1];
    const previous = this.trendData[this.trendData.length - 2];

    this.insights = [
      {
        label: 'Commits',
        value: latest.commits,
        trend: previous.commits ? ((latest.commits - previous.commits) / previous.commits) * 100 : 0
      },
      {
        label: 'Pull Requests',
        value: latest.pullRequests,
        trend: previous.pullRequests ? ((latest.pullRequests - previous.pullRequests) / previous.pullRequests) * 100 : 0
      },
      {
        label: 'Issues',
        value: latest.issues,
        trend: previous.issues ? ((latest.issues - previous.issues) / previous.issues) * 100 : 0
      }
    ];
  }
}
