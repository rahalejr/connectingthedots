import { Component } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { NextButtonComponent } from '../../interactive/next-button/next-button.component';

@Component({
  selector: 'app-background',
  standalone: true,
  imports: [NextButtonComponent],
  templateUrl: './background.component.html',
  styleUrl: './background.component.css'
})
export class BackgroundComponent {

  constructor(private nav: NavigationService) {}

}
