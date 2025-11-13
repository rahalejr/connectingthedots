import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { SlideComponent } from '../slide.component';
import { farmers_data } from '../../content/slide_data';
import { NextButtonComponent } from '../../interface/next-button/next-button.component';
import { MultipleChoiceComponent } from '../../interface/multiple-choice/multiple-choice.component';
import { NgSwitch, NgSwitchCase } from '@angular/common';
import { Subscription } from 'rxjs';
import { fadeAnimation } from '../../interface/animations';

@Component({
  selector: 'farmers',
  imports: [NextButtonComponent, MultipleChoiceComponent, NgSwitch, NgSwitchCase],
  templateUrl: './farmers.component.html',
  styleUrl: './farmers.component.css',
  animations: [fadeAnimation]
})
export class FarmersComponent extends SlideComponent {


  constructor(navigation: NavigationService) {
    super(navigation);
    this.all_frames = farmers_data;
    this.navigation.set_slide(this.all_frames);
    this.frame_object = this.all_frames[this.frame];
  }


  updateContent(): void {this.frame_object = this.all_frames[this.frame]}

  override nextFrame(): void {
    this.navigation.nextFrame();
    this.frame += 1;
    this.updateContent();
  }


}
