import { Component, Input } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { NextButtonComponent } from '../../interactive/next-button/next-button.component';
import { all_slides } from '../../content/slide_data';
import { Frame } from '../../content/models';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { MultipleChoiceComponent } from '../../interactive/multiple-choice/multiple-choice.component';

@Component({
  selector: 'slide',
  standalone: true,
  imports: [CommonModule, NextButtonComponent, MultipleChoiceComponent],
  templateUrl: './slide.component.html',
  styleUrl: './slide.component.css',
  animations: [
    trigger('fadeAnimation', [
      transition('* <=> *', [
        style({ opacity: 0 }),
        animate('0.5s ease-in-out', style({ opacity: 1 }))
      ])
    ]),
  ]
})
export class SlideComponent {

  slide: number = 0;
  frame: number = 0;
  format: string = 'text';
  content: Frame;
  animationState: string = '0-0';

  constructor(public navigation: NavigationService) {
    const [slide, frame] = this.navigation.getFrame();
    this.slide = slide;
    this.frame = frame;
    this.content = all_slides[slide].frames[frame];
    this.format = this.content.type;
    this.animationState = `${slide}-${frame}`;
  }

  nextFrame(): void {
    this.navigation.nextFrame();
    this.updateContent();
  }

  updateContent(): void {
    const [slide, frame] = this.navigation.getFrame();
    this.slide = slide;
    this.frame = frame;
    this.content = all_slides[slide].frames[frame];
    this.format = this.content.type;
    this.animationState = `${slide}-${frame}`;
  }

}
