import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../../services/navigation.service';

@Component({
    selector: 'landing',
    imports: [CommonModule],
    templateUrl: './landing.component.html',
    styleUrl: './landing.component.css'
})
export class LandingComponent {

  started = false;

  constructor(public navigation: NavigationService) {}

  ngOnInit() {
    this.navigation.started$.subscribe(value => {
      this.started = value;
    })
  }

  start(): void {
    this.navigation.start();
  }

  

}
