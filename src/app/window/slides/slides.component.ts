import { Component } from '@angular/core';
import { SlideCounterComponent } from '../../interface/slide-counter/slide-counter.component';
import { ProgressBarComponent } from '../../interface/progress-bar/progress-bar.component';
import { NavigationService } from '../../services/navigation.service';

@Component({
    selector: 'slides',
    imports: [SlideCounterComponent, ProgressBarComponent],
    templateUrl: './slides.component.html',
    styleUrl: './slides.component.css'
})
export class SlidesComponent {

  constructor(private navService: NavigationService) {}
  

}
