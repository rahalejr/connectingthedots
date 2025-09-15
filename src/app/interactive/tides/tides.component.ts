import { Component, ElementRef, Output, output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArrowComponent } from '../../interface/arrow/arrow.component';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'tides',
  standalone: true,
  imports: [CommonModule, ArrowComponent],
  templateUrl: './tides.component.html',
  styleUrl: './tides.component.css'
})
export class TidesComponent {

  @ViewChild('animWidth') tide_width!: ElementRef<SVGAnimateElement>;
  @ViewChild('animHeight') tide_height!: ElementRef<SVGAnimateElement>;
  @ViewChild('animShift') tide_shift!: ElementRef<SVGAnimateElement>;
  @ViewChild('animRevert') tide_revert!: ElementRef<SVGAnimateElement>;
  @ViewChild('animMoon') moon_orbit!: ElementRef<SVGAnimateElement>;

  wrapper!: HTMLElement | null;
  frame!: HTMLElement | null;
  stage = 0;

  @Output() complete = false;

  constructor(private nav: NavigationService) {}

  ngOnInit() {
    // this.nav.refresh_animations.subscribe(() => this.restart_animations())
    this.nav.refresh_animations.subscribe(() => {
      // this.restart_animations();
      console.log('triggered');
    })

  }

  ngAfterViewInit() {
    this.wrapper = document.getElementById('wrapper');
    this.frame   = document.getElementById('frame');
    window.addEventListener("load", () => {
      const svg = document.querySelector("#frame") as SVGSVGElement;
      if (svg) {
        svg.style.display = "none";
        requestAnimationFrame(() => {
          svg.style.display = "block";
        });
      }
    });
  }

  advance() {
    this.stage++;
    if (this.stage == 1) {
      this.tide_width.nativeElement.beginElement();
      this.tide_height.nativeElement.beginElement();
      this.tide_shift.nativeElement.beginElement();
    }
    else if (this.stage == 2) {
    }
    else if (this.stage == 3) {
      this.wrapper?.classList.remove('zoom');
      this.frame?.classList.add('rotate');
      this.tide_revert.nativeElement.beginElement();
    }

  }

  toggle_zoom() {
    this.stage++;
    this.tide_width.nativeElement.beginElement();
    this.tide_height.nativeElement.beginElement();
    this.tide_shift.nativeElement.beginElement();
    this.tide_revert.nativeElement.beginElement();

    // if (this.wrapper && this.frame) {
    //   if (!this.wrapper.classList.contains('zoom')) {
    //     this.wrapper.classList.add('zoom');
    //     this.frame.classList.remove('rotate-frame');
    //     // this.reset_animation(this.frame);
    //   }
    //   else  {
    //     this.wrapper.classList.remove('zoom');
    //     this.frame.classList.add('rotate-frame');
    //   }
    // }
    // return;
  }

  restart_animations() {
    this.tide_width?.nativeElement.beginElement();
    this.tide_height?.nativeElement.beginElement();
    this.tide_shift?.nativeElement.beginElement();
  }

}
