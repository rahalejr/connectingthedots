import { NavigationService } from '../services/navigation.service';

export abstract class SlideComponent {

  all_frames: Record<string, any>[] = [];
  frame = 0;
  frame_object: Record<string, any> = {};

  constructor(public navigation: NavigationService) {}

  // advance a frame; once we're on the last one, hand off to the next slide instead
  nextFrame(): void {
    if (this.frame >= this.all_frames.length - 1) {
      this.endSlide();
    } else {
      this.frame += 1;
      this.updateContent();
    }
  }

  protected endSlide(): void {
    this.navigation.nextSlide();
  }

  abstract updateContent(): void;

}
