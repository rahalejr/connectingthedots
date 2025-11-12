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
import { ChartComponent } from './interactive/chart/chart.component';
import { FarmersComponent } from './modules/farmers/farmers.component';
import { TidesTextComponent } from './modules/tides-text/tides-text.component';

@Component({
    selector: 'app-root',
    imports: [CommonModule, RouterOutlet, SlidesComponent, LandingComponent, BorderComponent,
        ProgressBarComponent, ConnectionComponent, HoseComponent, TidesComponent, ChartComponent,
        FarmersComponent, TidesTextComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Connecting The Dots';

  current_frame = 0;

  constructor(public navigation: NavigationService) {}

  ngOnInit() {this.navigation.current_frame$.subscribe(value => {
    this.current_frame = value;
  })}

}
