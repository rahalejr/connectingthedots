import { Component, Input, ElementRef, HostListener, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ConfigService } from '../../services/config.service';

@Component({
    selector: 'connection',
    imports: [CommonModule],
    templateUrl: './connection.component.html',
    styleUrl: './connection.component.css'
})
export class ConnectionComponent {

  @Input() from: ElementRef | undefined;
  @Input() to: ElementRef | undefined;
  @Input() container: ElementRef | undefined;

  pop: HTMLAudioElement | undefined;
  step: HTMLAudioElement | undefined;
  sound = true;

  spacingPx = 30;
  time_interval = 120;

  dots: { x: number; y: number }[] = [];
  current_dot = -1;
  private animating = false;

  p1 = { x: 0, y: 0 };
  p2 = { x: 0, y: 0 };


  constructor(@Inject(PLATFORM_ID) private platformId: Object, private cd: ChangeDetectorRef, private config: ConfigService) {
    if (isPlatformBrowser(this.platformId)) {
      this.pop = new Audio('assets/sound/pop.mp3');
      this.pop.load();
      this.pop.volume = 1;

      this.step = new Audio('assets/sound/step.mp3');
      this.step.load();
      this.step.volume = 0.5;
    }
    this.config.sound$.subscribe(on => this.sound = on);
  }

  private play(sound: HTMLAudioElement | undefined) {
    if (this.sound && sound) {
      sound.currentTime = 0;
      sound.play();
    }
  }

  @HostListener('window:resize')
  onResize() {
    // just reposition an already-drawn line — don't re-animate or touch the transition delay
    if (this.from && this.to && this.container) {
      this.measure();
      this.buildDots();
      if (this.current_dot >= 0 && !this.animating) this.current_dot = this.dots.length;
      this.cd.detectChanges();
    }
  }

  private measure() {
    const c = this.container!.nativeElement.getBoundingClientRect();
    const r1 = this.from!.nativeElement.getBoundingClientRect();
    const r2 = this.to!.nativeElement.getBoundingClientRect();

    this.p1 = { x: r1.left + r1.width / 2 - c.left, y: r1.top + r1.height / 2 - c.top };
    this.p2 = { x: r2.left + r2.width / 2 - c.left, y: r2.top + r2.height / 2 - c.top };
  }

  private buildDots() {
    this.dots = [];

    const dx = this.p2.x - this.p1.x;
    const dy = this.p2.y - this.p1.y;
    const distance = Math.hypot(dx, dy);

    if (distance < 1) return;

    const count = Math.floor(distance / this.spacingPx);

    for (let i = 1; i <= count - 1; i++) {
      const t = Math.min(1, (i * this.spacingPx) / distance);
      this.dots.push({ x: this.p1.x + dx * t, y: this.p1.y + dy * t });
    }
  }

  updateLine(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.from || !this.to || !this.container) {
        resolve();
        return;
      }

      this.measure();
      this.buildDots();

      if (this.current_dot < 0 && !this.animating) {
        this.animateDots().then(resolve);
      } else {
        resolve();
      }
    });
  }

  // reveal the dots in step with elapsed wall-clock time. driving this off rAF instead
  // of setInterval means a stalled frame can't queue up and dump every dot at once.
  animateDots(): Promise<void> {
    return new Promise((resolve) => {
      this.animating = true;
      const total = this.dots.length;
      const start = performance.now();

      const step = (now: number) => {
        const elapsed = now - start;
        // cap at the last real dot index — every dot is shown once current_dot hits total - 1
        const revealed = Math.min(total - 1, Math.floor(elapsed / this.time_interval));
        if (revealed > this.current_dot) {
          this.current_dot = revealed;
          this.cd.detectChanges();
          this.play(this.step);   // one tick per dot as it lands
        }

        if (elapsed >= total * this.time_interval) {
          this.play(this.pop);
          this.animating = false;
          resolve();
          return;
        }

        requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    });
  }

}
