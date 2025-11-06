import { Component } from '@angular/core';
import { SlideComponent } from '../slide/slide.component';
import { SlideCounterComponent } from '../../interface/slide-counter/slide-counter.component';
import { ProgressBarComponent } from '../../interface/progress-bar/progress-bar.component';
import { NavigationService } from '../../services/navigation.service';

@Component({
    selector: 'slides',
    imports: [SlideComponent, SlideCounterComponent, ProgressBarComponent],
    templateUrl: './slides.component.html',
    styleUrl: './slides.component.css'
})
export class SlidesComponent {

  constructor(private navService: NavigationService) {}
  

}
