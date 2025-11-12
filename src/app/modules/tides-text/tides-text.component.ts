import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule, NgSwitch } from '@angular/common';
import { NextButtonComponent } from '../../interface/next-button/next-button.component';
import { Component } from '@angular/core';
import { tides_data } from '../../content/slide_data';
import { NavigationService } from '../../services/navigation.service';
import { SlideComponent } from '../slide.component';
import { OptionBoxComponent } from '../../interface/option-box/option-box.component';

@Component({
  selector: 'tides-text',
  imports: [NgSwitch, NextButtonComponent, OptionBoxComponent, CommonModule],
  templateUrl: './tides-text.component.html',
  styleUrl: './tides-text.component.css',
  animations: [
    trigger('fadeAnimation', [
      transition('* <=> *', [
        style({ opacity: 0 }),
        animate('.8s ease-in-out', style({ opacity: 1 }))
      ])
    ]),
  ]
})
export class TidesTextComponent extends SlideComponent {

  constructor(navigation: NavigationService) {
    super(navigation);
    this.all_frames = tides_data;
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
