import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { SlideComponent } from '../slide.component';
import { farmers_data } from '../../content/slide_data';
import { NextButtonComponent } from '../../interface/next-button/next-button.component';
import { MultipleChoiceComponent } from '../../interface/multiple-choice/multiple-choice.component';
import { NgSwitch, NgSwitchCase } from '@angular/common';

@Component({
  selector: 'farmers',
  imports: [NextButtonComponent, MultipleChoiceComponent, NgSwitch, NgSwitchCase],
  templateUrl: './farmers.component.html',
  styleUrl: './farmers.component.css',
  animations: [
    trigger('fadeAnimation', [
      transition('* <=> *', [
        style({ opacity: 0 }),
        animate('0.5s ease-in-out', style({ opacity: 1 }))
      ])
    ]),
  ]
})
export class FarmersComponent extends SlideComponent {

  constructor(navigation: NavigationService) {
    super(navigation);
    this.all_frames = farmers_data;
    this.frame_object = this.all_frames[this.frame];
  }


  updateContent(): void {
    this.frame_object = this.all_frames[this.frame];
  }

}
