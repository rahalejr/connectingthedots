import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  slides: string[] = ['farmers', 'tides', 'orbit', 'prediction', 'matching', 'beakers']

  current_slide = -1;
  private slide_sub = new Subject<number>();
  private next_slide = new Subject<number>();
  next_slide$ = this.next_slide.asObservable();
  current_slide$ = this.slide_sub.asObservable();
  private started = new Subject<boolean>();
  started$ = this.started.asObservable();
  total_slides = 10;
  tides_module = false;

  slide_delay = 1500;
  private transitioning = false;

  nextSlide(): void {
    // ignore a second advance request while a transition (connection draw) is still in flight
    if (this.transitioning) return;
    this.transitioning = true;
    this.next_slide.next(this.current_slide + 1);
  }

  slideTransition(): void {
    this.current_slide++;
    this.slide_sub.next(this.current_slide);
    this.set_theme(this.current_slide);
    this.transitioning = false;
  }

  set_theme(slide: number) {
    document.body.className = '';
    document.body.classList.toggle(this.slides[slide]);
  }

  start() {
    this.started.next(true);
  }

}
