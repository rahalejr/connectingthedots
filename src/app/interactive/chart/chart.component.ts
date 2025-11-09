import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions, ChartData } from 'chart.js';
import { isPlatformBrowser, NgIf } from '@angular/common';


@Component({
  selector: 'chart',
  imports: [BaseChartDirective, NgIf],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css'
})
export class ChartComponent {
  totalDuration = 2000;

  data: { x: number; y: number }[] = [];
  data2: { x: number; y: number }[] = [];

  isBrowser = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    let prev = 100, prev2 = 80;
    for (let i = 0; i < 100; i++) {
      prev += 5 - Math.random() * 10;
      prev2 += 5 - Math.random() * 10;
      this.data.push({ x: i, y: prev });
      this.data2.push({ x: i, y: prev2 });
    }
  }

  get delayBetweenPoints() {
    return this.totalDuration / this.data.length;
  }

  private previousY = (ctx: any) =>
    ctx.index === 0
      ? ctx.chart.scales.y.getPixelForValue(100)
      : ctx.chart
          .getDatasetMeta(ctx.datasetIndex)
          .data[ctx.index - 1]
          .getProps(['y'], true).y;

  // Chart.js v4 progressive animation config
  animation = {
    x: {
      type: 'number',
      easing: 'linear',
      duration: () => this.delayBetweenPoints,
      from: NaN,
      delay: (ctx: any) => {
        if (ctx.type !== 'data' || ctx.xStarted) return 0;
        ctx.xStarted = true;
        return ctx.index * this.delayBetweenPoints;
      }
    },
    y: {
      type: 'number',
      easing: 'linear',
      duration: () => this.delayBetweenPoints,
      from: (ctx: any) => this.previousY(ctx),
      delay: (ctx: any) => {
        if (ctx.type !== 'data' || ctx.yStarted) return 0;
        ctx.yStarted = true;
        return ctx.index * this.delayBetweenPoints;
      }
    }
  };

  chartData: ChartData<'line'> = {
    datasets: [
      {
        borderColor: 'red',
        borderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 0,
        data: this.data
      },
      {
        borderColor: 'blue',
        borderWidth: 3,
        pointRadius: 0,         
        pointHoverRadius: 0,
        data: this.data2
      }
    ]
  };

  chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: this.animation as any,
    interaction: { intersect: false },
    plugins: { legend: { display: false } },
    scales: {
      x: {
        type: 'linear',
        ticks: {
          maxTicksLimit: 6,
          font: { size: 24 }
        }
      },
      y: {
        ticks: {
          maxTicksLimit: 4,
          font: { size: 24 },
        }
      }
    }
  };
  
}

