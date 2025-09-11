import { Component, Input, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

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

  spacingPx = 20;

  dots: { x: number; y: number }[] = [];
  current_dot = -1;

  p1 = { x: 0, y: 0 };
  p2 = { x: 0, y: 0 };


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

    for (let i = 0; i <= count; i++) {
      const distAlong = i * this.spacingPx;
      const t = Math.min(1, distAlong / distance);
      const x = this.p1.x + dx * t;
      const y = this.p1.y + dy * t;
      this.dots.push({x, y});
    }
  }


  updateLine() {
    if (!this.from || !this.to || !this.container) {
      console.log(this.from, this.to, this.container);
      return
    }

    const c = this.container.nativeElement.getBoundingClientRect();
    const r1 = this.from.nativeElement.getBoundingClientRect();
    const r2 = this.to.nativeElement.getBoundingClientRect();

    // convert viewport coords -> container coords
    this.p1 = { x: r1.left + r1.width / 2 - c.left, y: r1.top + r1.height / 2 - c.top };
    this.p2 = { x: r2.left + r2.width / 2 - c.left, y: r2.top + r2.height / 2 - c.top };

    console.log(r1, r2);

    this.buildDots();
    if (this.current_dot < 0) {
      this.animateDots();
    }
  }

  animateDots() {
    let i = 0;
    const interval = setInterval(() => {
      this.current_dot = i;
      i++;
      if (i > this.dots.length) clearInterval(interval);
    }, 50);
  }

}
