import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class SimulationService {
private modulePromise: Promise<any> | null = null;

constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

load(): Promise<any> {
if (!isPlatformBrowser(this.platformId)) {
return Promise.reject(new Error('LiquidFun can only be loaded in the browser'));
}

if (!this.modulePromise) {
  this.modulePromise = (async () => {
    // @ts-ignore package d.ts is not an ES module; dynamic import is fine
    const pkg = await import('liquidfun-wasm');
    const init: any = (pkg as any).default ?? pkg;
    return init({
      locateFile: (file: string) => `assets/liquidfun/es/${file}`
    });
  })();
}

return this.modulePromise;
}
}