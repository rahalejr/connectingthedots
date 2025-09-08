import { AfterViewChecked, AfterViewInit, Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { NavigationService } from '../services/navigation.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'border',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './border.component.html',
  styleUrl: './border.component.css'
})
export class BorderComponent implements AfterViewInit {
  @ViewChildren('iconimg', { read: ElementRef }) images!: QueryList<ElementRef>;
  @ViewChildren('section', { read: ElementRef }) sections!: QueryList<ElementRef>;
  state: 'state1' | 'state2' = 'state2';
  started = false;


  constructor(public navigation: NavigationService) {}

  ngAfterViewInit(): void {
    // this.animateWobble();
  }

  animateWobble(): void {
    const elements = this.images.toArray();
    let index = 0;

    const interval = setInterval(() => {
      if (index >= elements.length) {
        clearInterval(interval);
      }
      else if (index % 2 == 0) {
        elements[index].nativeElement.classList.add('wobble');
      }
      else {
        elements[index].nativeElement.classList.add('anti-wobble');
      }
      index++;
  }, 1000);}

  start(): void {
    this.state = this.state == 'state1' ? 'state2' : 'state1';
    this.images?.forEach(img => img.nativeElement.classList.remove('wobble', 'anti-wobble'));
    this.navigation.start();
    this.started = true;
    setTimeout(() => {
      this.navigation.nextSlide();
    }, 2500);
  }

  next(): void {
    console.log('working');
    this.navigation.nextSlide();
  }

}
