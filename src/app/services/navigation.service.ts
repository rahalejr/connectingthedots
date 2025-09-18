import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { all_slides } from '../content/slide_data';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  refresh_animations!: Observable<boolean>;
  hidden!: boolean;


  constructor(private ngZone: NgZone) {
    if (typeof document !== 'undefined') {
      this.hidden = document.hidden;
      this.refresh_animations = this.view_tracker();
    }
  }
  
  private view_tracker(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      const handler = () => this.ngZone.run(() => {
        if (this.hidden != document.hidden && !document.hidden) {observer.next(true);}
        this.hidden = document.hidden;
      });
      document.addEventListener('visibilitychange', handler);
      return () => document.removeEventListener('visibilitychange', handler);
    });
  }


  current_slide = 1;
  current_frame = 0;
  started = false;
  current_slide_len = 0;
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

  nextSlide(): void {
    this.current_slide++;
  }

  // returns indices as [slide, frame]
  getFrame(): number[] {return [this.current_slide, this.current_frame]}

  start() {this.started = true}
  hasStarted(): boolean {return this.started}

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
