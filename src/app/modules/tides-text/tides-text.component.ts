import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule, NgSwitch } from '@angular/common';
import { NextButtonComponent } from '../../interface/next-button/next-button.component';
import { Component } from '@angular/core';
import { tides_data } from '../../content/slide_data';
import { NavigationService } from '../../services/navigation.service';
import { SlideComponent } from '../slide.component';
import { OptionBoxComponent } from '../../interface/option-box/option-box.component';
import { fadeAnimation } from '../../interface/animations';

@Component({
  selector: 'tides-text',
  imports: [NgSwitch, NextButtonComponent, OptionBoxComponent, CommonModule],
  templateUrl: './tides-text.component.html',
  styleUrl: './tides-text.component.css',
  animations: [fadeAnimation]
})
export class TidesTextComponent extends SlideComponent {

  constructor(navigation: NavigationService) {
    super(navigation);
    this.all_frames = tides_data;
    this.navigation.set_slide(this.all_frames);
    this.frame_object = this.all_frames[this.frame];
  }

  ngOnInit() {
    this.navigation.set_slide(this.all_frames);
  }


  updateContent(): void {this.frame_object = this.all_frames[this.frame]}

  override nextFrame(): void {
    this.frame += 1;
    if (this.frame == tides_data.length - 1) {
      this.navigation.tides_module = true;
      return
    } 
    this.navigation.nextFrame();
    this.updateContent();
  }

}
