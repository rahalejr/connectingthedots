import { Component } from '@angular/core';
import { SlideComponent } from '../slide/slide.component';
import { all_slides } from '../../content/slide_data';
import { NextButtonComponent } from '../../interactive/next-button/next-button.component';

@Component({
  selector: 'slides',
  standalone: true,
  imports: [SlideComponent, NextButtonComponent],
  templateUrl: './slides.component.html',
  styleUrl: './slides.component.css'
})
export class SlidesComponent {

  current_slide = 0;
  current_frame = 0;
  current_slide_len = this.slideLength(this.current_slide);

  nextFrame(): void {
    if (this.current_slide_len - 1 == this.current_frame){
      this.current_slide = this.current_slide + 1;
      this.current_frame = 0;
      this.current_slide_len = this.slideLength(this.current_slide);
    }
    else {
      this.current_frame = this.current_frame + 1
    }
  }

  slideLength(slide: number): number {return all_slides[slide].frames.length}



}
