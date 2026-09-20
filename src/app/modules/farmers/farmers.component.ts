import { Component } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { SlideComponent } from '../slide.component';
import { farmers_data } from '../../content/slide_data';
import { NextButtonComponent } from '../../interface/next-button/next-button.component';
import { MultipleChoiceComponent } from '../../interface/multiple-choice/multiple-choice.component';
import { NgSwitch, NgSwitchCase } from '@angular/common';
import { fadeAnimation } from '../../interface/animations';
import { NgClass } from '@angular/common';

@Component({
  selector: 'farmers',
  imports: [NextButtonComponent, MultipleChoiceComponent, NgSwitch, NgSwitchCase, NgClass],
  templateUrl: './farmers.component.html',
  styleUrl: './farmers.component.css',
  animations: [fadeAnimation]
})
export class FarmersComponent extends SlideComponent {


  disable = false;

  constructor(navigation: NavigationService) {
    super(navigation);
    this.all_frames = farmers_data;
    this.frame_object = this.all_frames[this.frame];
  }


  updateContent(): void {this.frame_object = this.all_frames[this.frame]}

  protected override endSlide(): void {
    this.disable = true;
    this.navigation.nextSlide();
  }


}
