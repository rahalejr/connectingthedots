import { Component } from '@angular/core';
import { SlideComponent } from '../slide/slide.component';
import { all_slides } from '../../content/slide_data';
import { NextButtonComponent } from '../../interactive/next-button/next-button.component';
import { MultipleChoiceComponent } from '../../interactive/multiple-choice/multiple-choice.component';

@Component({
  selector: 'slides',
  standalone: true,
  imports: [SlideComponent, NextButtonComponent, MultipleChoiceComponent],
  templateUrl: './slides.component.html',
  styleUrl: './slides.component.css'
})
export class SlidesComponent {

  

}
