import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { SimulationService } from '../../services/simulation.service';
import { CommonModule } from '@angular/common';

declare var window: any;

@Component({
  selector: 'hose',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hose.component.html',
  styleUrl: './hose.component.css'
})
export class HoseComponent implements AfterViewInit, OnDestroy {
  loading = true;
  error?: string;
  mod?: any;
  
  constructor(
  private sim: SimulationService,
  @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  
  async ngAfterViewInit() {
  if (!isPlatformBrowser(this.platformId)) {
  this.loading = false;
  return; // don’t run WASM on the server
  }
  try {
  this.mod = await this.sim.load();
  console.log('LiquidFun loaded:', Object.keys(this.mod));
  
    // Minimal sanity check: create a world and step it once
    const { b2World, b2Vec2 } = this.mod;
    const world = new b2World(new b2Vec2(0, -10));
    world.Step(1 / 60, 8, 3);
    console.log('World stepped OK');
  } catch (e: any) {
    this.error = e?.message || String(e);
    console.error('Failed to load LiquidFun', e);
  } finally {
    this.loading = false;
  }
  }
  
  ngOnDestroy() {}
  }
