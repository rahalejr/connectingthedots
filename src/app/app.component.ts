import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { RouterOutlet } from '@angular/router';
import { LandingComponent } from './window/landing/landing.component';
import { BorderComponent } from './window/border/border.component';
import { HoseComponent } from './interactive/hose/hose.component';
import { TidesComponent } from './interactive/tides/tides.component';
import { NavigationService } from './services/navigation.service';
import { ChartComponent } from './interactive/chart/chart.component';
import { FarmersComponent } from './modules/farmers/farmers.component';
import { TidesTextComponent } from './modules/tides-text/tides-text.component';
import { ChartMatchingComponent } from './interactive/chart_matching/chart_matching.component';

@Component({
    selector: 'app-root',
    imports: [CommonModule, LandingComponent, BorderComponent,
        HoseComponent, TidesComponent, ChartComponent, FarmersComponent,
        TidesTextComponent, ChartMatchingComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Connecting The Dots';

  current_frame = 0;
  current_slide = -1;

  constructor(public nav: NavigationService) {}

  ngOnInit() {
    this.nav.current_frame$.subscribe(value => this.current_frame = value);
    this.nav.current_slide$.subscribe(value => this.current_slide = value);
  }

}
