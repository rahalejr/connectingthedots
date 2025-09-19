import { Component, ElementRef, Output, output, viewChild, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArrowComponent } from '../../interface/arrow/arrow.component';
import { NavigationService } from '../../services/navigation.service';
import { DragDirective } from '../../directives/drag.directive';

@Component({
  selector: 'tides',
  standalone: true,
  imports: [CommonModule, ArrowComponent, DragDirective],
  templateUrl: './tides.component.html',
  styleUrl: './tides.component.css'
})
export class TidesComponent {

  @ViewChild('animWidth') tide_width!: ElementRef<SVGAnimateElement>;
  @ViewChild('animHeight') tide_height!: ElementRef<SVGAnimateElement>;
  @ViewChild('animShift') tide_shift!: ElementRef<SVGAnimateElement>;
  @ViewChild('animRevert') tide_revert!: ElementRef<SVGAnimateElement>;
  @ViewChild('animMoon') moon_orbit!: ElementRef<SVGAnimateElement>;
  @ViewChild('earth') earth_el!: ElementRef<HTMLElement>;
  @ViewChild('moon') moon_el!: ElementRef<HTMLElement>;
  @ViewChild('ocean') ocean_el!: ElementRef<HTMLElement>;
  @ViewChild('svg_frame') frame!: SVGSVGElement;
  @ViewChild('svg_frame') frame_el!: ElementRef;

  wrapper!: HTMLElement | null;
  stage = 0;
  drag_point = -35;
  start_drag = false;
  drag_position: {x: number, y: number} = {x: 0, y: 0};
  stop_rotation = false;
  button_opacity = 1;

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
    console.log(this.frame);
    this.wrapper = document.getElementById('wrapper');
    window.addEventListener("load", () => {
      const svg = this.frame_el.nativeElement;
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
      this.button_opacity = 0;
      this.track_cycle().then(() => {
        this.wrapper?.classList.remove('zoom');
        this.stop_rotation = true;
        this.tide_revert.nativeElement.beginElement(); 
        this.button_opacity = 1;
      });
    }
    else if (this.stage == 4) {
      this.moon_progress().then(() => {
        this.frame_el.nativeElement.pauseAnimations();
        this.stop_rotations();
        this.start_drag = true;
      });
    }

  }

  toggle_zoom() {
    this.stage++;
    this.tide_width.nativeElement.beginElement();
    this.tide_height.nativeElement.beginElement();
    this.tide_shift.nativeElement.beginElement();
    this.tide_revert.nativeElement.beginElement();
  }

  getRotation(el: SVGSVGElement): number {
    const style = window.getComputedStyle(el);
    const transform = style.getPropertyValue("transform");
  
    if (transform === "none") return 0;
  
    const values = transform.match(/matrix\(([^)]+)\)/);
    if (!values) return 0;
    const parts = values[1].split(",").map(v => parseFloat(v.trim()));
    const [a, b] = parts;
    const angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
    return angle < 0 ? angle + 360 : angle;
  }

  stop_rotations() {
    this.earth_el.nativeElement.style.animationPlayState = 'paused';
    this.moon_el.nativeElement.style.animation = 'none';
    this.ocean_el.nativeElement.style.animation = 'none';
  }

  restart_animations() {
    this.tide_width?.nativeElement.beginElement();
    this.tide_height?.nativeElement.beginElement();
    this.tide_shift?.nativeElement.beginElement();
  }

  update_coord(val: number) {
    console.log(val);
  }

  update_pixels(vals: {x: number, y: number}) {
    setTimeout(() => {
      this.drag_position = vals;
    });
  }

  track_cycle(): Promise<void> {
    return new Promise(resolve => {
      const tracker = setInterval(() => {
        if (this.frame_el) {
          const angle = this.getRotation(this.frame_el.nativeElement);
          console.log(angle);
          if (angle < 182 && angle > 178) {
            console.log('reached 0');
            clearInterval(tracker);
            resolve();
          }
        }
      }, 10);
    });
  }

  moon_progress(): Promise<void> {
    return new Promise(resolve => {
      const track_prog = setInterval(() => {
        let prog = this.moon_orbit.nativeElement.ownerSVGElement!.getCurrentTime() % 10 / 10;
        console.log(prog);
        if (prog > .73 && prog < .75) {
          clearInterval(track_prog);
          resolve();
        }
      }, 10);
    });
  }

  stop_animations() {
    return;
  }
}
