import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ApexChart, ApexXAxis, ApexYAxis, ApexDataLabels, ApexPlotOptions, ApexTooltip, ApexLegend, ApexFill, ApexTitleSubtitle, ChartComponent } from 'ng-apexcharts';
import { FilterService } from '../../../services/filter.service';

interface Contribution {
  user: string;
  contribution: number;
}

@Component({
  selector: 'app-contribution-heatmap',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  template: `
    <div class="p-6 w-full">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Contribution Activity
      </h2>
      <apx-chart
        [series]="chartSeries"
        [chart]="chartOptions"
        [xaxis]="xaxis"
        [yaxis]="yaxis"
        [dataLabels]="dataLabels"
        [plotOptions]="plotOptions"
        [tooltip]="tooltip"
        [legend]="legend"
        [fill]="fill"
        [title]="title">
      </apx-chart>
    </div>
  `
})
export class ContributionHeatmapComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;
  chartSeries: any[] = [];
  chartOptions: ApexChart = {
    type: 'heatmap',
    height: 350,
    toolbar: { show: false },
  };
  xaxis: ApexXAxis = { type: 'category', categories: [] };
  yaxis: ApexYAxis = { labels: { show: true } };
  dataLabels: ApexDataLabels = { enabled: false };
  plotOptions: ApexPlotOptions = {
    heatmap: {
      shadeIntensity: 0.5,
      colorScale: {
        ranges: [
          { from: 0, to: 20, color: '#D6E9C6' },
          { from: 21, to: 40, color: '#BFEFFF' },
          { from: 41, to: 60, color: '#FAD02E' },
          { from: 61, to: 80, color: '#FF8C00' },
          { from: 81, to: 100, color: '#FF4500' }
        ]
      }
    }
  };
  tooltip: ApexTooltip = { enabled: true };
  legend: ApexLegend = { show: false };
  fill: ApexFill = { opacity: 1 };
  title: ApexTitleSubtitle = { text: 'Heatmap of Contributions' };

  constructor(
      private filterService: FilterService
    ) { }

  ngOnInit() {
    this.filterService.contributors$.subscribe((contributors) => {
    this.loadDummyData(contributors);
    });
    this.loadDummyData({});
  }

  private loadDummyData(contributors: any) {
    const dummyData: Contribution[] = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 29); // Last 30 days

    for (let i = 0; i < contributors.length; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dummyData.push({
        user: contributors[i].user,
        contribution: (contributors[i].totalIssuesDone/contributors[i].totalIssues)*100
      });
    }

    this.xaxis.categories = dummyData.map(d => d.user);
    this.chartSeries = [{
      name: 'Contributions',
      data: dummyData.map(d => ({
        x: d.user,
        y: Number.isNaN(parseInt(d.contribution.toString())) ? 0 : parseInt(d.contribution.toString())
      }))
    }];
  }
}
