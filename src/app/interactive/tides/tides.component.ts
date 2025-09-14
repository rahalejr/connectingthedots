import { Component } from '@angular/core';

@Component({
  selector: 'tides',
  standalone: true,
  imports: [],
  templateUrl: './tides.component.html',
  styleUrl: './tides.component.css'
})
export class TidesComponent {

  wrapper!: HTMLElement | null;
  frame!: HTMLElement | null;

  ngAfterViewInit() {
    this.wrapper = document.getElementById('wrapper');
    this.frame   = document.getElementById('frame');
  }

  toggle_zoom() {
    if (this.wrapper && this.frame) {
      if (this.wrapper.classList.contains('zoom')) {
        this.wrapper.classList.remove('zoom');
        this.frame.classList.remove('stabilize');
      }
      else  {
        this.wrapper.classList.add('zoom');
        this.frame.classList.add('stabilize');
      }
    }
    return;
  }

}
