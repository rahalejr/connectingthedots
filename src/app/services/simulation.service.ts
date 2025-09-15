import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import Box2DFactory from '../../vendor/liquidfun-browser'; // <-- the wrapper

@Injectable({ providedIn: 'root' })
export class SimulationService {
private modulePromise!: Promise<any>; // definite assignment

constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

load(): Promise<any> {
if (!isPlatformBrowser(this.platformId)) {
return Promise.reject(new Error('LiquidFun can only be loaded in the browser'));
}

if (!this.modulePromise) {
  this.modulePromise = Box2DFactory({
    locateFile: (f: string) =>
      new URL(`assets/liquidfun/${f}`, document.baseURI).toString()
  }) as unknown as Promise<any>;
}
return this.modulePromise;
}
}