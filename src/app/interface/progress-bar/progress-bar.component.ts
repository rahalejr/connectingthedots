import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'progress-bar',
    imports: [CommonModule],
    templateUrl: './progress-bar.component.html',
    styleUrl: './progress-bar.component.css'
})
export class ProgressBarComponent implements OnChanges {

  radius = 18;
  circumference = 2 * Math.PI * this.radius;

  @Input() progress: number = 0;
  @Input() show: boolean = false;

  dashOffset = this.circumference;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['progress']) {
      this.setProgress(this.progress);
    }
  }

  setProgress(percent: number) {
    const offset = this.circumference - (percent / 100) * this.circumference;
    this.dashOffset = offset;
  }

}
