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
  reveal = false;

  initialized = [false, false, false, false];
  names = ['solar', 'volcanic', 'human', 'global'];
  colors = ['rgba(195,203,113,1)', 'rgba(174,90,65,1)', 'rgba(27,133,184,1)', 'rgba(85,158,131,1)'];
  scales = [[-.25, .25], [-.25, .25], [-1, 1], [-1, 1]]
  current_scale = [-1, 1];

  colors_rgb: Record<string, string> = {
    'solar': '195,203,113',
    'volcanic': '174,90,65',
    'human': '27,133,184',
    'global': '85,158,131'
  };

  rgba(name: string, alpha: number) {
    return `rgba(${this.colors_rgb[name]}, ${alpha})`;
  }

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
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }
      // tooltip: {
      //   callbacks: {
      //     title: items => {
      //       const x = items[0].parsed.x as number;
      //       return String(Math.round(x));
      //     },
      //     label: item => {
      //       const y = item.parsed.y as number;
      //       return `${item.dataset.label}: ${y.toFixed(2)}`;
      //     }
      //   }
      // }
    },
    scales: {
      x: {
        type: 'linear',
        min: 1870,
        max: 2010,
        ticks: {
          callback: v => String(v),
          stepSize: 30,
          font: { size: 14 }
        }
      },
      y: {
        min: -1,
        max: 1,
        ticks: {
          maxTicksLimit: 4,
          font: { size: 14 },
          callback: v => Number(v).toFixed(1)
        }
      }
    }
  };

  addLine(name: 'human' | 'volcanic' | 'solar' | 'global' | 'left_smooth' | 'right_smooth', color: string, index: number) {

    this.change_range(this.scales[index]);

    if (this.initialized[index]) {
      this.select_line(name, index)
      this.to_front(name);
      return;
    }
    
    setTimeout(() => {
      const data = this.dataSetsMap[name];

      const ds = {
        label: name,
        data,
        borderColor: this.rgba(name, 1),
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0
      };
      this.initialized[index] = true;
      (this.chartData.datasets as any).push(ds);
      this.chart?.update();
    }, 800)
    this.select_line(name, index);
  }

  change_range(range: number[], duration = 800) {
    if (range == this.current_scale) return;
    const chart = this.chart?.chart
    if (!chart) return;
  
    const yScale = chart.scales['y'];
    if (!yScale) return;

    let old_range = this.current_scale;
  
    const start = performance.now();
  
    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = t * t * (3 - 2 * t);
  
      (yScale.options as any).min = old_range[0] + (range[0] - old_range[0]) * ease;
      (yScale.options as any).max = old_range[1] + (range[1] - old_range[1]) * ease;
      chart.update('none');
  
      if (t < 1) requestAnimationFrame(step);
    };
  
    requestAnimationFrame(step);
    this.current_scale = range;
  }

  select_line(name: string, index: number) {
    for (const ds of this.chartData.datasets) {
      const is_target = ds.label == name;

      (ds as any).borderColor = is_target ? this.rgba(ds.label as string, 1) : this.rgba(ds.label as string, .3);
      (ds as any).borderWidth = is_target ? 4 : 2;
    }
    this.chart?.update();
  }
  
  to_front(name: string) {
    const dsIndex = this.chartData.datasets.findIndex(d => d.label === name);
    if (dsIndex === -1) return;
  
    const ds = this.chartData.datasets[dsIndex];
    this.chartData.datasets.splice(dsIndex, 1);
    this.chartData.datasets.push(ds);
    this.chart?.update();
  }
  
}