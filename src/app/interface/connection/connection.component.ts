import { Component, Input, ElementRef, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'connection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './connection.component.html',
  styleUrl: './connection.component.css'
})
export class ConnectionComponent {

  @Input() from: ElementRef | undefined;
  @Input() to: ElementRef | undefined;
  @Input() container: ElementRef | undefined;

  open = true;

  pop : HTMLAudioElement | undefined;
  tick: HTMLAudioElement | undefined;
  pew!: HTMLAudioElement;

  spacingPx = 30;

  dots: { x: number; y: number }[] = [];
  current_dot = -1;

  p1 = { x: 0, y: 0 };
  p2 = { x: 0, y: 0 };


  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.pop = new Audio('assets/sound/pop.mp3');
      this.tick = new Audio('assets/sound/tick.m4a');
      this.pew = new Audio('assets/sound/pew.m4a');
      this.pop.load();
      this.tick.load();
      this.pew.load();
      this.pew.loop = true;
      this.pop.volume = 1;
    }
  }


  @HostListener('window:resize')
  onResize() {
    if (this.to && this.from) {
      this.updateLine();
    }
    return;
  }

  private buildDots() {
    this.dots = [];

    const dx = this.p2.x - this.p1.x;
    const dy = this.p2.y - this.p1.y;
    const distance = Math.hypot(dx, dy);

    if (distance < 1) return;

    const count = Math.floor(distance / this.spacingPx);

    for (let i = 1; i <= count-1; i++) {
      const distAlong = i * this.spacingPx;
      const t = Math.min(1, distAlong / distance);
      const x = this.p1.x + dx * t;
      const y = this.p1.y + dy * t;
      this.dots.push({x, y});
    }
  }


  updateLine(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.from || !this.to || !this.container) {
        resolve();
        return;
      }
  
      const c = this.container.nativeElement.getBoundingClientRect();
      const r1 = this.from.nativeElement.getBoundingClientRect();
      const r2 = this.to.nativeElement.getBoundingClientRect();
  
      this.p1 = { x: r1.left + r1.width / 2 - c.left, y: r1.top + r1.height / 2 - c.top };
      this.p2 = { x: r2.left + r2.width / 2 - c.left, y: r2.top + r2.height / 2 - c.top };
  
      this.buildDots();
      if (this.current_dot < 0) {
        this.animateDots().then(() => resolve());
      } else {
        resolve();
      }
    });
  }

  animateDots(): Promise<void> {
    return new Promise((resolve) => {
      let i = 0;
      const interval = setInterval(() => {
        this.current_dot = i;
        i++;
        if (i > this.dots.length) {
          // this.pew.pause();
          // this.pew.currentTime = 0;

          if (this.pop) {
            this.pop.currentTime = 0; 
            this.pop.play();
          }
          clearInterval(interval);
          resolve();
        }
        if (this.open) {
          // this.pew.play();
          this.open = false;
        }
      }, 120);
    });
  }

}
