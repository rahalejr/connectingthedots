import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  debug = true;
  
  private sound = new Subject<boolean>();
  sound$ = this.sound.asObservable();

  constructor() { }

  toggle_sound() {
    console.log('toggled');
    this.sound.next(!this.sound)
  }

  debug_mode() {return this.debug}

}
