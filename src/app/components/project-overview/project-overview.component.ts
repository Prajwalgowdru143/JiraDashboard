import { Component, OnInit, ViewChild } from '@angular/core';
import { ContributionService } from '../../services/contribution.service';
import { CommonModule } from '@angular/common';
import { ChartComponent, NgApexchartsModule } from "ng-apexcharts";
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexFill,
  ApexDataLabels,
  ApexLegend
} from "ng-apexcharts";
import { FormsModule } from '@angular/forms';
import { FilterService } from '../../services/filter.service';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  fill: ApexFill;
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
};

interface ProjectStats {
  issueLeft: number;
  issueDone: number;
}

@Component({
  selector: 'app-project-overview',
  standalone: true,
  imports: [CommonModule, ChartComponent, NgApexchartsModule, FormsModule],
  template: `<div class="p-6">
  <div class="flex flex-col justify-between items-center mb-6">
    <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
      Project Overview
    </h2>



  <!-- Scrollable Projects Grid -->
  <div class="max-h-full border border-gray-200 w-full flex justify-center dark:border-gray-700 rounded-lg p-2">
    <div id="chart" class="h-fit">
          <apx-chart
    [series]="chartOptions.series"
    [chart]="chartOptions.chart"
    [labels]="chartOptions.labels"
    [fill]="chartOptions.fill"
    [dataLabels]="chartOptions.dataLabels"
    [responsive]="chartOptions.responsive"
  ></apx-chart>
        </div>
  </div>
</div>
  `
})
export class ProjectOverviewComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent | undefined;
  public chartOptions: Partial<ChartOptions>;
  topProjectStats: ProjectStats = { issueLeft: 0, issueDone: 0 };
  
  constructor(private contributionService: ContributionService, private filterService: FilterService) {
    this.chartOptions = {
      series: [44, 55] as ApexNonAxisChartSeries,  // Ensure correct type
      chart: {
        width: 380,
        type: "donut"
      },
      labels: ["Issues Left", "Issues Done"],
      dataLabels: {
        enabled: false
      },
      fill: {
        type: "gradient"
      },
      legend: {
        formatter: function (val, opts) {
          return val + " - " + opts.w.globals.series[opts.seriesIndex];
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }


  ngOnInit() {
    // **Listen for project key changes**
    this.filterService.projectKey$.subscribe((projectKey) => {
      this.getIsuues(projectKey);
    });

    // Load initial data
    this.getIsuues('');
  }


  private getIsuues(projectKey: string) {
    this.contributionService.getProjectIsuues(projectKey)
      .then((response) => {
       
      
  
        // Update chart data
        if (response) {
          const issueLeft = response.totalIssuesResponse.total-response.totalIssuesDoneResponse.total || 0;
          const issueDone = response.totalIssuesDoneResponse.total || 0;
          this.chartOptions = { 
            ...this.chartOptions, 
            series: [issueLeft, issueDone] as ApexNonAxisChartSeries,
            labels: ["Issues Left", "Issues Done"],
          };
        }
      })
      .catch((error) => console.error('Error loading department stats:', error));
  }
  
  
}
