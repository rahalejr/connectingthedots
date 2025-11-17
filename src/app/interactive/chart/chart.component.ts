import { Component, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions, ChartData } from 'chart.js';
import { isPlatformBrowser, NgIf } from '@angular/common';
import { human, volcanic, solar, noise, global } from '../../data/climate_data.js';
import { graph_prediction } from '../../content/slide_data';
import { NavigationService } from '../../services/navigation.service.js';
import { NextButtonComponent } from '../../interface/next-button/next-button.component.js';
import { fadeAnimation } from '../../interface/animations.js';
import { NgClass } from '@angular/common';
import { PassThrough } from 'stream';

@Component({
  selector: 'chart',
  imports: [BaseChartDirective, NgIf, NextButtonComponent, NgClass],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css',
  animations: [fadeAnimation]
})
export class ChartComponent {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  totalDuration = 2000;
  isBrowser = false;
  reveal = false;
  disabled = true;

  initialized = [false, false, false, false, false];
  names = ['solar', 'volcanic', 'human', 'noise', 'global'];
  labels = ['one', 'two', 'three', 'four', 'global'];
  colors = ['rgba(205,139,98,1)', 'rgba(174,90,65,1)', 'rgba(27,133,184,1)', 'rgba(85,158,131,1)', 'rgba(90,82,85,1)'];
  scales = [[-.25, .25], [-.25, .25], [-1, 1], [-.5, .5], [-1,1]]
  current_scale = [-1, 1];
  all_selected = true;
  selected = '';

  colors_rgb: Record<string, string> = {
    'solar': '205,139,98',
    'volcanic': '174,90,65',
    'human': '27,133,184',
    'noise': '85,158,131',
    'global': '90,82,85'
  };

  rgba(name: string, alpha: number) {
    return `rgba(${this.colors_rgb[name]}, ${alpha})`;
  }

  dataSetsMap: Record<string, {x:number;y:number}[]> = { human, volcanic, solar, noise, global };

  frame: number = 0;
  frame_object: Record<string, any> = {};
  advance = false;
  show_slider = false;
  stage = 0;

  constructor(@Inject(PLATFORM_ID) platformId: Object, public nav: NavigationService) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.nav.set_slide(graph_prediction);
    this.frame_object = graph_prediction[this.frame];
    setTimeout(() => {this.advance = true}, 2800);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.chart?.chart?.resize();
      this.chart?.update();
    }, 0);
    this.addLine('global', this.colors[4], 4)
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

  addLine(name: 'human' | 'volcanic' | 'solar' | 'noise' | 'global', color: string, index: number) {

    this.change_range(this.scales[index]);

    if (this.initialized[index]) {
      this.select_line(name, index)
      this.to_front(name);
      return;
    }
    else {
      this.initialized[index] = true;
      if (this.initialized.every(v => v == true)) {
        setTimeout(()=>{this.all_selected = true}, 2800);
      }
      this.disabled = true;
      setTimeout(() => {
        this.disabled = false;
      }, 2800);
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
      (this.chartData.datasets as any).push(ds);
      this.chart?.update();
      this.select_line(name, index);
    }, 800)
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
    this.current_scale = range;
    requestAnimationFrame(step);
  }

  select_line(name: string, index: number, store=true) {
    store? this.selected = name : false
    for (const ds of this.chartData.datasets) {
      const is_target = ds.label == name;

      (ds as any).borderColor = is_target ? this.rgba(ds.label as string, 1) : this.rgba(ds.label as string, .1);
      (ds as any).borderWidth = is_target ? 3 : 2;
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

  nextFrame() {
    this.nav.nextFrame();
    this.advance=false;
  
    this.frame = this.frame + 1;
    this.frame_object = graph_prediction[this.frame];
    this.stage = this.frame_object['stage']

    if (this.stage == 0) {
      setTimeout(() => {this.advance = true}, 2800);
    }
    else if (this.stage == 1) {
      this.disabled = false;
      this.all_selected = false;
      setTimeout(() => {this.advance = true}, 2800);
    }
    else if (this.stage == 2) {
      this.disabled = true;
      this.change_range([-1,1]);
      this.select_line('human', 2);
      setTimeout(()=>{this.select_line('global',4,false)}, 1000)
      setTimeout(()=>{this.select_line('human',2,false)}, 2000)
      setTimeout(() => {this.advance = true}, 3500);
    }

    else if (this.stage == 3) {
      for (let i = 0; i < this.labels.length-1; i++) {
        setTimeout(()=>{
            this.select_line(this.names[i],i);
            this.labels[i] = this.names[i];
          }, 2000 * (i + 1))
      }
      setTimeout(() => {this.advance = true}, 8500);
    }
    else if (this.stage == 4) {
      this.select_line('human', 2);
      setTimeout(() => {this.advance = true}, 2800);
    }
  }
  
}