import { Component, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData } from 'chart.js';
import { point_animation, climate_chart_options } from '../chart-util';
import { isPlatformBrowser, NgIf } from '@angular/common';
import { smooth_left, smooth_right, rough_left, rough_right} from '../../data/climate_data.js';
import { SliderComponent } from '../../interface/slider/slider.component.js';
import { NavigationService } from '../../services/navigation.service.js';
import { graph_matching } from '../../content/slide_data';
import { NextButtonComponent } from '../../interface/next-button/next-button.component.js';
import { fadeAnimation } from '../../interface/animations.js';
import { NgClass } from '@angular/common';

@Component({
  selector: 'chart-matching',
  imports: [BaseChartDirective, NgIf, SliderComponent, NextButtonComponent, NgClass],
  templateUrl: './chart_matching.component.html',
  styleUrl: './chart_matching.component.css',
  animations: [fadeAnimation]
})
export class ChartMatchingComponent {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  totalDuration = 2000;
  isBrowser = false;
  reveal = false;
  slider_val = 50;
  y_label = false;

  initialized = [false, false, false, false];
  names = ['smooth_left', 'smooth_right', 'rough_right'];
  colors = ['rgba(27,133,184,1)', 'rgba(174,90,65,1)', 'rgba(27,133,184,1)', 'rgba(85,158,131,1)'];
  scales = [[-1, 1], [-1, 1]]
  current_scale = [-1, 1];
  projection = smooth_right.map(p => ({...p}));

  

  colors_rgb: Record<string, string> = {
    'smooth_left': '27,133,184',
    'smooth_right': '174,90,65',
    'human': '27,133,184',
    'noise': '85,158,131'
  };

  rgba(name: string, alpha: number) {
    return `rgba(${this.colors_rgb[name]}, ${alpha})`;
  }

  dataSetsMap: Record<string, {x:number;y:number}[]> = { smooth_left, smooth_right, rough_right };

  frame: number = 0;
  frame_object: Record<string, any> = {};
  advance = true;
  show_slider = false;

  constructor(@Inject(PLATFORM_ID) platformId: Object, public nav: NavigationService) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.frame = 0;
    this.frame_object = graph_matching[this.frame];
  }

  nextFrame() {
    if (this.frame >= graph_matching.length - 1) {
      this.nav.nextSlide();
      return;
    }

    this.frame = this.frame + 1;
    this.frame_object = graph_matching[this.frame];

    if (this.frame == 2) {
      this.addLine('smooth_left', 0, true);
      this.advance = false;
      setTimeout(() => {this.advance = true}, 2800);
    }
    else if (this.frame == 5) {
      this.advance = false;
      this.addLine('smooth_right', 1)
      setTimeout(() => {this.show_slider = true}, 2800);
      setTimeout(() => {this.advance = true}, 3800);
    }
    else if (this.frame == 6) {
      this.show_slider = false;
      this.advance = false;
      setTimeout(() => {this.animate_shift(this.slider_val, 50)}, 1500);
      setTimeout(() => {this.advance = true}, 2800);
    }
    else if (this.frame == 7) {
      this.advance = false;
      this.add_right();
      setTimeout(() => {this.animate_shift(this.slider_val, 100, this.colors[0])}, 1800);
      setTimeout(() => {this.advance = true}, 2800);
    }
    else if (this.frame == 9) {
      this.y_label = true;
    }
  }
  

  get delayBetweenPoints() {
    return this.totalDuration / Math.max(1, (this.chartData.datasets[0]?.data as any[])?.length ?? 1);
  }

  chartData: ChartData<'line'> = { datasets: [] };
  animation = {
    ...point_animation(() => this.delayBetweenPoints),
    borderColor: { duration: 200, easing: 'linear', type: 'color' }
  };
  chartOptions = climate_chart_options(this.animation, { min: 1880, max: 2020, stepSize: 35 });



  addLine(name: string, index: number, init=false, color: string | null = null) {

    setTimeout(() => {
      let data = this.dataSetsMap[name]
      if (name == 'smooth_right') {
        data = this.starting_vector()
      }

      const ds = {
        label: name,
        data,
        borderColor: color? color : this.rgba(name, 1),
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
    }, 800)
  }

  add_right() {
    const points_ds = {
      label: name + '_points',
      data: rough_right,
      type: 'line',
      showLine: false,
      pointRadius: 2,
      pointHoverRadius: 3,
      borderWidth: 0,
      borderColor: 'gray',
      pointBackgroundColor: 'gray'
    };

    (this.chartData.datasets as any).push(points_ds);
    this.chart?.update();
  }


  update_projection(value = 0, animate = false, color: string | null = null) {
    this.slider_val = value;
    value = 100 - value;
    const factor = this.slider_conversion(value);
    const i = this.chartData.datasets.findIndex(ds => ds.label == 'smooth_right');
    const old = this.projection;
    const modified = this.subtract_vector(old, factor);
    const target = this.chartData.datasets[i].data as any[];
    for (let j = 0; j < target.length; j++) {
      target[j].y = modified[j].y;
    }
    if(color) {(this.chartData.datasets[i] as any).borderColor = color}
    animate? this.chart?.update() : this.chart?.update('none');
  }

  starting_vector() {
    const value = 50
    const factor = this.slider_conversion(value);
    return this.subtract_vector(this.projection, factor);
  }

  subtract_vector(data: {x:number; y:number}[], factor = 0) {

    let vector = Array.from({ length: data.length + 1 }, (_, x) => (.0001*Math.pow(x, 2))*factor)
    
    return data.map((p, i) => ({
      x: p.x,
      y: p.y - vector[i]
    }));
  }

  animate_shift(from: number, to: number, color: null | string = null) {
    const step = from < to ? 1 : -1;
    let current = from;
  
    const tick = () => {
      this.update_projection(current, false, color);
  
      if (current === to) return;
      current += step;
  
      setTimeout(tick, 10);
    };
  
    tick();
  }

  slider_conversion(v: number): number {
    const bounded = (v / 100) * 7;
    return Math.round(bounded * 100) / 100;
  }

}