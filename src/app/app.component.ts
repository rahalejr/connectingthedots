import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SlidesComponent } from './window/slides/slides.component';
import { LandingComponent } from './window/landing/landing.component';
import { BorderComponent } from './window/border/border.component';
import { ConnectionComponent } from './interface/connection/connection.component';
import { ProgressBarComponent } from './interface/progress-bar/progress-bar.component';
import { HoseComponent } from './interactive/hose/hose.component';
import { TidesComponent } from './interactive/tides/tides.component';
import { NavigationService } from './services/navigation.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SlidesComponent, LandingComponent, BorderComponent, 
    ProgressBarComponent, ConnectionComponent, HoseComponent, TidesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Connecting The Dots';

  constructor(public navigation: NavigationService) {}

}
