import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { NavigationService } from '../services/navigation.service';

@Component({
  selector: 'border',
  standalone: true,
  imports: [],
  templateUrl: './border.component.html',
  styleUrl: './border.component.css'
})
export class BorderComponent {
  @ViewChildren('icon img', { read: ElementRef }) images!: QueryList<ElementRef>;
  private intervalId: any;
  state: 'state1' | 'state2' = 'state1';

  ngOnInit(): void {
    // Start the wobble effect
    this.startWobbling();
  }

  start(): void {
    this.state = this.state == 'state1' ? 'state2' : 'state1';
  }

  startWobbling(): void {
    this.intervalId = setInterval(() => {
      this.images.forEach((img) => {
        const randomRotation = this.getRandomRotation(-15, 15); // Random angle between -15 and 15 degrees
        img.nativeElement.style.transform = `rotate(${randomRotation}deg)`;
      });
      console.log('test');
    }, 500);
  }

  private getRandomRotation(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

}
