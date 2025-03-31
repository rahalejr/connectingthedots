import { Component } from '@angular/core';
import { SlideComponent } from '../slide/slide.component';
import { SlideCounterComponent } from '../../interactive/slide-counter/slide-counter.component';
import { ProgressBarComponent } from '../../interactive/progress-bar/progress-bar.component';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'slides',
  standalone: true,
  imports: [SlideComponent, SlideCounterComponent, ProgressBarComponent],
  templateUrl: './slides.component.html',
  styleUrl: './slides.component.css'
})
export class SlidesComponent {

  constructor(private navService: NavigationService) {}
  

}
