import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SlidesComponent } from './window/slides/slides.component';
import { LandingComponent } from './landing/landing.component';
import { BorderComponent } from './border/border.component';
import { ConnectionComponent } from './interactive/connection/connection.component';
import { ProgressBarComponent } from './interactive/progress-bar/progress-bar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SlidesComponent, LandingComponent, BorderComponent, ProgressBarComponent, ConnectionComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'connectingthedots';
}
