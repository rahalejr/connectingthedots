import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  debug = false;
  
  private sound = new BehaviorSubject<boolean>(true);
  sound$ = this.sound.asObservable();

  constructor() { }

  toggle_sound() {
    const newValue = !this.sound.value;  // compute new value first
    this.sound.next(newValue);
    console.log('toggled', newValue);

    document.querySelectorAll('audio, video')
      .forEach(el => (el as HTMLMediaElement).muted = !newValue);
  }

}
