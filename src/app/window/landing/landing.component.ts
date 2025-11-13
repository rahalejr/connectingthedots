import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../../services/navigation.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'landing',
    imports: [CommonModule],
    templateUrl: './landing.component.html',
    styleUrl: './landing.component.css'
})
export class LandingComponent {

  started = false;
  private subscriptions = new Subscription();

  constructor(public navigation: NavigationService) {}

  ngOnInit() {
    this.subscriptions.add(this.navigation.started$.subscribe(value => {
      this.started = value;
    }))
  }

  start(): void {
    if (!this.started) {
      this.navigation.start();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
