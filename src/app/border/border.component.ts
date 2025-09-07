import { AfterViewChecked, AfterViewInit, Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { NavigationService } from '../services/navigation.service';

@Component({
  selector: 'border',
  standalone: true,
  imports: [],
  templateUrl: './border.component.html',
  styleUrl: './border.component.css'
})
export class BorderComponent implements AfterViewInit {
  @ViewChildren('iconimg', { read: ElementRef }) images!: QueryList<ElementRef>;
  state: 'state1' | 'state2' = 'state1';

  ngAfterViewInit(): void {
    console.log(this.images);
    this.animateWobble();
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
  }



  private getRandomRotation(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

}
