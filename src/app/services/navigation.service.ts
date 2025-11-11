import { Injectable, NgZone } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  slides: string[] = ['farmers', 'tides', 'orbit', 'prediction']

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


  current_slide = -1;
  private slide_sub = new Subject<number>();
  current_slide$ = this.slide_sub.asObservable();
  current_frame = 0;
  slide_object: {}[] = [];
  private started = new Subject<boolean>();
  started$ = this.started.asObservable();
  total_slides = 10;

  nextFrame(): void {
    if (this.slide_object.length - 1 == this.current_frame){
      this.nextSlide();
      this.current_frame = 0;
    }
    else {
      this.current_frame = this.current_frame + 1
    }
  }

  nextSlide(): void {
    console.log('shit piss');
    this.current_slide++;
    this.slide_sub.next(this.current_slide)
    this.set_theme(this.current_slide);
  }

  set_theme(slide: number) {
    document.body.className = '';
    document.body.classList.toggle(this.slides[slide]);
  }

  set_slide(obj: {}[]) {
    this.slide_object = obj;
  }

  getFrame(): number[] {return [this.current_slide, this.current_frame]}

  start() {
    this.started.next(true);
  }

  slideLength(slide: number): number {return this.slide_object.length}


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
