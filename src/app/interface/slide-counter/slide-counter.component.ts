import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../../services/navigation.service';

@Component({
    selector: 'slide-counter',
    imports: [CommonModule],
    templateUrl: './slide-counter.component.html',
    styleUrl: './slide-counter.component.css'
})
export class SlideCounterComponent {

  constructor(public nav: NavigationService) {}

  total_slides = [].constructor(this.nav.total_slides)
  current_slide = this.nav.current_slide;

}
