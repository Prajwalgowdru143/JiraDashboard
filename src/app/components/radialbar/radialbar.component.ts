import { Component, ElementRef, AfterViewInit, ViewChild } from "@angular/core";
import * as d3 from "d3";
import { FilterService } from "../../services/filter.service";

@Component({
  selector: "app-radialbar",
  standalone: true,
  template: `
    <div class="p-6">
      <div class="flex flex-col justify-between items-center mb-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          Contribution Radial Stats
        </h2>
        <div
          class=" w-full flex justify-center dark:border-gray-700 rounded-lg p-2"
        >
          <div #chartContainer></div>
        </div>
      </div>
    </div>
  `,
})
export class RadialbarComponent implements AfterViewInit {
  @ViewChild("chartContainer", { static: true }) chartContainer!: ElementRef;

  private width = 250;
  private height = 250;
  private radius = Math.min(this.width, this.height) / 2;
  private color = d3.scaleOrdinal(d3.schemeCategory10);

  private data: any = { name: "Contributors", children: [] };

  constructor(private filterService: FilterService) {}

  ngAfterViewInit(): void {
    this.fetchContributorData();
  }

  private fetchContributorData(): void {
    this.filterService.contributors$.subscribe((stats: any) => {
      const contributors = Object.keys(stats).map((key) => ({
        name: stats[key]?.user ,
        children: [
          { name: "IssuesDone", value: stats[key]?.totalIssuesDone || 0 },
          { name: "IssuesLeft", value: (stats[key]?.totalIssues || 0) - (stats[key]?.totalIssuesDone || 0) },
        ],
      }));
  
      this.data = {
        name: "Contributors",
        children: contributors,
      };
  
      this.createSunburstChart();
    });
  }
  
  
  private createSunburstChart(): void {
    // Clear existing chart
    d3.select(this.chartContainer.nativeElement).selectAll("*").remove();
  
    const svg = d3
      .select(this.chartContainer.nativeElement)
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .append("g")
      .attr("transform", `translate(${this.width / 2},${this.height / 2})`);
  
    const partition = d3.partition<any>().size([2 * Math.PI, this.radius]);
  
    const root = d3
      .hierarchy(this.data)
      .sum((d: any) => d.value || 0)
      .sort((a, b) => b.value! - a.value!);
  
    partition(root);
  
    const arc = d3
      .arc<d3.HierarchyRectangularNode<any>>() // Explicitly use HierarchyRectangularNode
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .innerRadius((d) => d.y0)
      .outerRadius((d) => d.y1); //  Fix: TypeScript now recognizes y1
  
    // Tooltip
    const tooltip = d3
      .select(this.chartContainer.nativeElement)
      .append("div")
      .style("position", "absolute")
      .style("background", "#333")
      .style("color", "#fff")
      .style("padding", "5px 10px")
      .style("border-radius", "5px")
      .style("display", "none");
  
    const paths = svg
      .selectAll("path")
      .data(root.descendants().slice(1))
      .enter()
      .append("path")
      .attr("d", arc as any)
      .style("fill", (d) => this.color(d.data.name))
      .style("stroke", "#fff")
      .style("cursor", "pointer")
      .on("mouseover", function (event, d) {
        d3.select(this).style("opacity", 0.7);
  
        tooltip
          .style("display", "block")
          .html(
            `<strong>${d.data.name}</strong>: ${d.value}`
          )
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 20}px`);
      })
      .on("mouseout", function () {
        d3.select(this).style("opacity", 1);
        tooltip.style("display", "none");
      });
  
    // Add text labels inside arcs
    svg
      .selectAll("text")
      .data(root.descendants().slice(1))
      .enter()
      .append("text")
      .attr("transform", (d) => {
        const [x, y] = arc.centroid(d as d3.HierarchyRectangularNode<any>);
        return `translate(${x},${y})`;
      })
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .style("font-size", "10px")
      .style("fill", "#fff")
      .text((d) => ((d as d3.HierarchyRectangularNode<any>).y1 - (d as d3.HierarchyRectangularNode<any>).y0 > 10 ? d.data.name : ""));
  }
  
}
