import { Component, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions, ChartData } from 'chart.js';
import { isPlatformBrowser, NgIf } from '@angular/common';
import { smooth_left, smooth_right, rough_left} from '../../data/climate_data.js';
import { SliderComponent } from '../../interface/slider/slider.component.js';

@Component({
  selector: 'chart-matching',
  imports: [BaseChartDirective, NgIf, SliderComponent],
  templateUrl: './chart_matching.component.html',
  styleUrl: './chart_matching.component.css'
})
export class ChartMatchingComponent {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  totalDuration = 2000;
  isBrowser = false;
  reveal = false;
  slider_val = 3;

  initialized = [false, false, false, false];
  names = ['smooth_left', 'smooth_right'];
  colors = ['rgba(27,133,184,1)', 'rgba(174,90,65,1)', 'rgba(27,133,184,1)', 'rgba(85,158,131,1)'];
  scales = [[-1, 1], [-1, 1]]
  current_scale = [-1, 1];
  projection = smooth_right.map(p => ({...p}));

  ngAfterViewInit() {
    this.addLine('smooth_left', this.colors[0], 0, true);
    this.addLine('smooth_right', this.colors[1], 1)
  }

  colors_rgb: Record<string, string> = {
    'smooth_left': '27,133,184',
    'smooth_right': '174,90,65',
    'human': '27,133,184',
    'noise': '85,158,131'
  };

  rgba(name: string, alpha: number) {
    return `rgba(${this.colors_rgb[name]}, ${alpha})`;
  }

  dataSetsMap: Record<string, {x:number;y:number}[]> = { smooth_left, smooth_right };

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
        min: 1880,
        max: 2020,
        ticks: {
          callback: v => String(v),
          stepSize: 35,
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

  addLine(name: string, color: string, index: number, init=false) {

    if (this.initialized[index]) {
      // this.select_line(name, index)
      // this.to_front(name);
      return;
    }
    

    setTimeout(() => {
      const data = this.dataSetsMap[name];

      const ds = {
        label: name,
        data,
        borderColor: this.rgba(name, 1),
        borderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 0
      };
      this.initialized[index] = true;
      (this.chartData.datasets as any).push(ds);

      if (init) {
        const points_ds = {
          label: name + '_points',
          data: rough_left,
          type: 'line',
          showLine: false,
          pointRadius: 2,
          pointHoverRadius: 3,
          borderWidth: 0,
          borderColor: 'gray',
          pointBackgroundColor: 'gray'
        };
  
        (this.chartData.datasets as any).push(points_ds);
      }

      this.chart?.update();
      // this.select_line(name, index);
    }, 800)
  }

  update_projection(value = 0) {
    const factor = this.slider_conversion(value);
    const i = this.chartData.datasets.findIndex(ds => ds.label == 'smooth_right');
    const old = this.projection;
    const modified = this.subtract_vector(old, factor);
    const target = this.chartData.datasets[i].data as any[];
    for (let j = 0; j < target.length; j++) {
      target[j].y = modified[j].y;
    }
    this.chart?.update('none');
  }

  subtract_vector(data: {x:number; y:number}[], factor = 0) {

    let vector = Array.from({ length: data.length + 1 }, (_, x) => (.0001*Math.pow(x, 2))*factor)
    
    return data.map((p, i) => ({
      x: p.x,
      y: p.y - vector[i]
    }));
  }

  slider_conversion(v: number): number {
    const bounded = ((v / 100) * 6) + 1;
    return Math.round(bounded * 100) / 100;
  }
  
  

  
}