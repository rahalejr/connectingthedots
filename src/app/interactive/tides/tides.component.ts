import { ChangeDetectorRef, Component, ElementRef, Output, output, viewChild, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NextButtonComponent } from '../../interface/next-button/next-button.component';
import { NavigationService } from '../../services/navigation.service';
import { DragDirective } from '../../directives/drag.directive';
import { Subscription } from 'rxjs';
import { tides_text, orbit_text } from '../../content/slide_data';
import { fadeAnimation } from '../../interface/animations';
import { TideCap } from '../../content/models';
import { LoadingComponent } from '../../interface/loading/loading.component';

@Component({
    selector: 'tides',
    imports: [CommonModule, NextButtonComponent, DragDirective, LoadingComponent],
    templateUrl: './tides.component.html',
    styleUrl: './tides.component.css',
    animations: [fadeAnimation]
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
  current_frame = 0;
  frame_object: TideCap = {
    texts: [''],
    stage: 0,
    template: 'z'
  };
  bottom_text = 1;
  drag_point = -35;
  start_drag = false;
  loading = false;
  drag_position: {x: number, y: number} = {x: 0, y: 0};
  projection_path = "M -35,-33 Q -35,-25 -35,0";
  actual_path = this.projection_path = `M -35,0 Q -35,-25 -35,-33`;
  stop_rotation = false;
  button_opacity = true;
  window_opacity = 0;
  earth_shift = false;
  slide_object = tides_text;
  ladies_and_gentlemen_we_are_floating_in_space = false;
  private subscriptions = new Subscription();

  constructor(private nav: NavigationService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.nav.set_slide(tides_text);
    // this.nav.refresh_animations.subscribe(() => this.restart_animations())
    this.nav.refresh_animations.subscribe(() => {
      // this.restart_animations();
    })
    setTimeout(() => {
      this.window_opacity = 1;
    }, 500);

    this.frame_object = tides_text[this.current_frame];

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

  async nextFrame() {
    this.button_opacity = false;

    let newFrameIndex = this.current_frame + 1;
    console.log(newFrameIndex);
    if (!this.ladies_and_gentlemen_we_are_floating_in_space && newFrameIndex == tides_text.length) {
      this.nav.set_slide(orbit_text);
      this.slide_object = orbit_text;
      this.nav.nextSlide();
      this.ladies_and_gentlemen_we_are_floating_in_space = true;
      newFrameIndex = 0;
    }
    else if (this.ladies_and_gentlemen_we_are_floating_in_space && newFrameIndex == 6) {
      this.nav.nextFrame();
      return
    }
    else {
      this.nav.nextFrame();

    }

    const d = this.slide_object;

    const newFrameObject = d[newFrameIndex];
    if (newFrameObject.stage == 3 ) {
      this.bottom_text = 0;
      this.cdr.detectChanges();
    }
    else {
      this.bottom_text = (newFrameObject.texts.length > 1)? 1 : 0;
    }


    if (newFrameObject.stage == 3) {
      setTimeout(() => {
        this.current_frame = newFrameIndex;
        this.frame_object = newFrameObject
      }, 1000)
    }
    else {
      this.frame_object = newFrameObject;
      this.current_frame = newFrameIndex;
    }
  
    if (newFrameObject.stage > this.stage) {
      this.advance();
    }

    if (this.stage != 3) {setTimeout(() => this.button_opacity = true, 1500)};
  }

  advance() {
    this.stage++;
    if (this.stage == 1) {
      this.tide_width.nativeElement.beginElement();
      this.tide_height.nativeElement.beginElement();
      this.tide_shift.nativeElement.beginElement();
    }
    else if (this.stage == 2) {
      this.earth_shift = true;
    }
    else if (this.stage == 3) {
      this.loading = true;
      this.track_cycle().then(() => {
        this.loading = false;
        this.button_opacity = false;
        this.earth_shift = false;
        this.wrapper?.classList.remove('zoom');
        this.stop_rotation = true;
        this.tide_revert.nativeElement.beginElement(); 
        this.earth_el.nativeElement.style.animationDuration = "0.5s";
        setTimeout(() => this.advance(), 1500)
      });
    }
    else if (this.stage == 4) {
      this.moon_progress().then(() => {
        this.bottom_text = 1;
        this.frame_el.nativeElement.pauseAnimations();
        this.stop_rotations();
        this.start_drag = true;
        this.update_coord();
        setTimeout(() => this.button_opacity = true, 6500)
      });
    }
    else if (this.stage == 5) {
      this.start_drag = false;
      this.actual_path = `M -35,0 Q -35,-25 ${-35},-33`;
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

  // need to fix
  restart_animations() {
    this.tide_width?.nativeElement.beginElement();
    this.tide_height?.nativeElement.beginElement();
    this.tide_shift?.nativeElement.beginElement();
  }

  update_coord(val: number = -35) {
    if (val != -35 && !this.button_opacity && this.start_drag) {
      this.button_opacity = true;
    }
    this.drag_point = val;
    this.projection_path = `M -35,0 Q -35,-25 ${val},-33`;
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
          if (angle < 182 && angle > 178) {
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

  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
