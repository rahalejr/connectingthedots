import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  debug = true;

  constructor() { }

  debug_mode() {return this.debug}

}
