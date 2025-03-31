import { Injectable } from '@angular/core';
import { all_slides } from '../content/slide_data';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {


  current_slide = 0;
  current_frame = 0;
  current_slide_len = this.slideLength(this.current_slide);
  total_slides = all_slides.length

  nextFrame(): void {
    if (this.current_slide_len - 1 == this.current_frame){
      this.current_slide = this.current_slide + 1;
      this.current_frame = 0;
      this.current_slide_len = this.slideLength(this.current_slide);
    }
    else {
      this.current_frame = this.current_frame + 1
    }
  }

  // returns indices as [slide, frame]
  getFrame(): number[] {return [this.current_slide, this.current_frame]}

  slideLength(slide: number): number {return all_slides[slide].frames.length}


  // Timer logic

  private intervalId?: number;
  private startTime = 0;
  elapsedTime = 0;

  startTimer(duration: number, onFinish: () => void): void {
    this.startTime = Date.now();
    this.elapsedTime = 0;

    this.intervalId = window.setInterval(() => {
      this.elapsedTime = Date.now() - this.startTime;
      if (this.elapsedTime >= duration) {
        this.stopTimer();
        onFinish();
      }
    }, 100);
  }

  stopTimer(): void {
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = undefined;
  }



}
