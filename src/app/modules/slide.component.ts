import { Subscription } from 'rxjs';
import { NavigationService } from '../services/navigation.service';

export abstract class SlideComponent {

  all_frames: Record<string, any>[] = [];
  slide: number = 0;
  frame: number = 0;
  frame_object: Record<string, any> = {}; 
  title = '';
  private subscriptions = new Subscription();

  constructor(public navigation: NavigationService) {
    const [slide, frame] = this.navigation.getFrame();
    this.slide = slide;
    this.frame = frame;
  }

  nextFrame(): void {
    this.navigation.nextFrame();
    this.frame += 1;
    this.updateContent();
  }

  abstract updateContent(): void;


}
