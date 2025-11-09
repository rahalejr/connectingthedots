import { Component, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions, ChartData } from 'chart.js';
import { isPlatformBrowser, NgIf } from '@angular/common';
import { human, volcanic, solar, global } from '../../data/climate_data.js';

@Component({
  selector: 'chart',
  imports: [BaseChartDirective, NgIf],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css'
})
export class ChartComponent {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  totalDuration = 2000;
  isBrowser = false;

  dataSetsMap: Record<string, {x:number;y:number}[]> = { human, volcanic, solar, global };

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  get delayBetweenPoints() {
    return this.totalDuration / Math.max(1, (this.chartData.datasets[0]?.data as any[])?.length ?? 1);
  }

  private previousY = (ctx: any) =>
    ctx.index === 0
      ? ctx.chart.scales.y.getPixelForValue(0)
      : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1]
          .getProps(['y'], true).y;

  animation = {
    x: {
      type: 'number',
      easing: 'linear',
      duration: () => this.delayBetweenPoints,
      from: NaN,
      delay: (ctx: any) => (ctx.type !== 'data' || ctx.xStarted ? 0 : (ctx.xStarted = true, ctx.index * this.delayBetweenPoints))
    },
    y: {
      type: 'number',
      easing: 'linear',
      duration: () => this.delayBetweenPoints,
      from: (ctx: any) => this.previousY(ctx),
      delay: (ctx: any) => (ctx.type !== 'data' || ctx.yStarted ? 0 : (ctx.yStarted = true, ctx.index * this.delayBetweenPoints))
    }
  };

  chartData: ChartData<'line'> = { datasets: [] };

  chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: this.animation as any,
    interaction: { intersect: false },
    plugins: { legend: { display: true } },
    scales: {
      x: {
        type: 'linear',
        min: 1870,
        max: 2010,
        ticks: { maxTicksLimit: 6, font: { size: 14 } }
      },
      y: {
        min: -1,
        max: 1,
        ticks: { maxTicksLimit: 4, font: { size: 14 } }
      }
    }
  };

  addLine(name: 'human' | 'volcanic' | 'solar' | 'global', color = 'black') {
    const data = this.dataSetsMap[name];

    const ds = {
      label: name,
      data,
      borderColor: color,
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 0
    };

    this.chartData = { datasets: [...this.chartData.datasets, ds] };
    this.chart?.update();
  }

  setLineColor(name: string, color: string) {
    const ds = this.chartData.datasets.find(d => d.label === name);
    if (!ds) return;
    (ds as any).borderColor = color;
    this.chartData = { datasets: [...this.chartData.datasets] };
    this.chart?.update();
  }

  change_range(toMin: number, toMax: number, duration = 800) {
    const chart = this.chart?.chart;                 // ng2-charts -> underlying Chart.js instance
    if (!chart) return;
  
    const yScale = chart.scales['y'];               // <-- use the runtime scale, not config.options
    if (!yScale) return;
  
    const fromMin = (yScale.options as any).min ?? -1;
    const fromMax = (yScale.options as any).max ??  1;
  
    const start = performance.now();
  
    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // smoothstep easing
      const ease = t * t * (3 - 2 * t);
  
      (yScale.options as any).min = fromMin + (toMin - fromMin) * ease;
      (yScale.options as any).max = fromMax + (toMax - fromMax) * ease;
  
      // Re-render WITHOUT restarting element animations
      chart.update('none');
  
      if (t < 1) requestAnimationFrame(step);
    };
  
    requestAnimationFrame(step);
  }
  
  
  
}