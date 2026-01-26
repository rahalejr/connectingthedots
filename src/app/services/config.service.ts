import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  debug = true;
  
  private sound = new BehaviorSubject<boolean>(true);
  sound$ = this.sound.asObservable();

  constructor() { }

  toggle_sound() {
    console.log('toggled');
    this.sound.next(!this.sound);
    document.querySelectorAll('audio, video')
      .forEach(el => (el as HTMLMediaElement).muted = !this.sound.value);
  }

  debug_mode() {return this.debug}

}
