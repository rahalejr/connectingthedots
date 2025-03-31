import { Component, Input } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { NextButtonComponent } from '../../interactive/next-button/next-button.component';
import { ProgressBarComponent } from '../../interactive/progress-bar/progress-bar.component';
import { all_slides } from '../../content/slide_data';
import { Frame } from '../../content/models';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { MultipleChoiceComponent } from '../../interactive/multiple-choice/multiple-choice.component';

@Component({
  selector: 'slide',
  standalone: true,
  imports: [CommonModule, NextButtonComponent, MultipleChoiceComponent, ProgressBarComponent],
  templateUrl: './slide.component.html',
  styleUrl: './slide.component.css',
  animations: [
    trigger('fadeAnimation', [
      transition('* <=> *', [
        style({ opacity: 0 }),
        animate('0.5s ease-in-out', style({ opacity: 1 }))
      ])
    ]),
  ]
})
export class SlideComponent {

  slide: number = 0;
  frame: number = 0;
  format: string = 'text';
  title = '';
  content: Frame;
  slide_time = 5000; // 5000ms = 5s
  start_time: number = Date.now();
  elapsed_time: number = 0;
  animationState: string = '0-0';
  selected_option = -1;

  private interval: any;

  allow_next = false;

  ngAfterViewInit() {
    this.startTimer();
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  constructor(public navigation: NavigationService) {
    const [slide, frame] = this.navigation.getFrame();
    this.slide = slide;
    this.frame = frame;
    this.title = all_slides[slide].title;
    this.content = all_slides[slide].frames[frame];
    this.format = this.content.type;
    if (this.content.duration) {this.slide_time = this.content.duration}
    this.slide_time = this.slide_time
    this.animationState = `${slide}-${frame}`;
  }

  nextFrame(): void {
    this.navigation.nextFrame();
    this.updateContent();
    this.startTimer();
  }

  updateContent(): void {
    const [slide, frame] = this.navigation.getFrame();
    this.slide = slide;
    this.frame = frame;
    this.content = all_slides[slide].frames[frame];
    if (this.frame == 0) {this.title = all_slides[slide].title}
    this.format = this.content.type;
    this.selected_option = -1;
    this.animationState = `${slide}-${frame}`;
  }

  startTimer(): void {
    clearInterval(this.interval);
    this.start_time = Date.now();
    this.elapsed_time = 0;
    this.allow_next = false;
  
    this.interval = setInterval(() => {
      this.elapsed_time = Date.now() - this.start_time;
      if(this.elapsed_time >= this.slide_time){
        this.elapsed_time = this.slide_time;
        this.allow_next = true;
        clearInterval(this.interval);
      }
    }, 10);
  }

  selectOption(index: number): void {this.selected_option = index}

  timerWidth(): number {return Math.round((this.elapsed_time / this.slide_time)*100)}

}
