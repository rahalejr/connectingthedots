import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { SimulationService } from '../../services/simulation.service';
import { SliderComponent } from '../../interface/slider/slider.component';
import { ConfigService } from '../../services/config.service';
import { fadeAnimation } from '../../interface/animations';
import { NavigationService } from '../../services/navigation.service';
import { hose_data } from '../../content/slide_data';
import { SlideComponent } from '../../modules/slide.component';
import { NextButtonComponent } from '../../interface/next-button/next-button.component';
import { Slide, SlideCap } from '../../content/models';

@Component({
  selector: 'hose',
  imports: [CommonModule, SliderComponent, NextButtonComponent],
  templateUrl: './hose.component.html',
  styleUrl: './hose.component.css',
  animations: [fadeAnimation]
})
export class HoseComponent extends SlideComponent implements AfterViewInit, OnDestroy {
  @ViewChild('cv', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  spray_sound: HTMLAudioElement | undefined;
  valve_sound: HTMLAudioElement | undefined;

  private world: any;
  private particleSystem: any;
  private mod: any;
  private ctx!: CanvasRenderingContext2D;
  private raf = 0;
  private pixelsPerMeter = 160;

  override all_frames: SlideCap[];
  override frame_object: SlideCap;

  stage = 1;
  on = false;
  spraying = false;
  disable = false;

  private pd: any;
  private pPos: any;
  private pVel: any;
  private gravity: any;
  private shootPoint = { x: -2, y: 0.3 };
  private shootDir = { x: 1, y: 0 };
  private shootSpeed = 8;

  private tubeWalls: { cx: number; cy: number; hx: number; hy: number }[] = [];

  private readonly fixedTimeStep = 1 / 120;
  private readonly maxFrameDt = 1 / 15;
  private readonly maxSubSteps = 8;

  private stepAccumulator = 0;
  private emitAccumulator = 0;

  private readonly emitRate = 5000;
  private readonly maxParticles = 2500;

  private resizeHandler = () => {
    if (this.canvasRef?.nativeElement) {
      this.resizeCanvas(this.canvasRef.nativeElement);
    }
  };

  constructor(
    private sim: SimulationService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private config: ConfigService,
    navigation: NavigationService
  ) {
    super(navigation);

    if (isPlatformBrowser(this.platformId)) {
      this.valve_sound = new Audio('assets/sound/new_valve.m4a');
      this.spray_sound = new Audio('assets/sound/hose_spray.m4a');

      this.valve_sound.load();
      this.spray_sound.load();
      this.spray_sound.loop = true;
      this.spray_sound.volume = 0.2;
      this.valve_sound.volume = 0.5;
    }

    this.all_frames = hose_data;
    this.navigation.set_slide(this.all_frames);
    this.frame_object = this.all_frames[this.frame];
  }

  ngOnInit() {
    this.config.sound$.subscribe(value => this.mute_audio(!value));
  }

  advance() {
    console.log('advance called, stage:', this.stage);
    this.stage += 1;

    if (this.stage === 3) {
      this.emitWater(this.fixedTimeStep);
      this.setGravity(1, 0);
    }

    if (this.stage === 4) {
      cancelAnimationFrame(this.raf);
      if (isPlatformBrowser(this.platformId)) {
        window.removeEventListener('resize', this.resizeHandler);
      }
    }

    if ([2, 3, 4, 5, 6].includes(this.stage)) {
      if (this.stage === 6) {
        this.start_hose();
        this.nextFrame(false);
        return;
      }
      this.nextFrame();
    }
  }

  override nextFrame(update = true): void {
    this.navigation.nextFrame();
    if (update) {
      this.frame += 1;
      this.updateContent();
    } else {
      this.disable = true;
    }
  }

  updateContent(): void {
    this.frame_object = this.all_frames[this.frame];
  }

  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resizeCanvas(canvas);
    window.addEventListener('resize', this.resizeHandler);

    this.mod = await this.sim.load();
    this.gravity = new this.mod.b2Vec2(-1, -29);
    this.world = new this.mod.b2World(this.gravity);

    this.createTube();
    this.initParticleSystem();

    let last = performance.now();

    const tick = (t: number) => {
      let frameDt = (t - last) / 1000;
      last = t;

      if (!Number.isFinite(frameDt) || frameDt < 0) {
        frameDt = 0;
      }

      frameDt = Math.min(frameDt, this.maxFrameDt);
      this.stepAccumulator += frameDt;

      let subSteps = 0;
      while (this.stepAccumulator >= this.fixedTimeStep && subSteps < this.maxSubSteps) {
        this.stepSimulation(this.fixedTimeStep);
        this.stepAccumulator -= this.fixedTimeStep;
        subSteps += 1;
      }

      if (subSteps === this.maxSubSteps) {
        this.stepAccumulator = 0;
      }

      this.draw();
      this.raf = requestAnimationFrame(tick);
    };

    this.raf = requestAnimationFrame(tick);
  }

  ngOnDestroy() {
  }

  private stepSimulation(dt: number) {
    if (this.spraying) {
      this.emitWater(dt);
    }

    this.world.Step(dt, 8, 3, this.getParticleIterations(dt));
  }

  private getParticleIterations(dt: number): number {
    if (this.mod && typeof this.mod.b2CalculateParticleIterations === 'function') {
      const g = Math.hypot(this.gravity.x, this.gravity.y);
      const r = this.particleSystem.GetRadius();
      const iterations = this.mod.b2CalculateParticleIterations(g, r, dt);
      return Math.max(1, Math.min(8, Math.round(iterations)));
    }

    return 5;
  }

  private resizeCanvas(canvas: HTMLCanvasElement) {
    const parent = canvas.parentElement;
    if (!parent) return;

    const width = parent.clientWidth;
    const height = parent.clientHeight;
    const dpr = Math.max(1, window.devicePixelRatio || 1);

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    const visibleWorldWidth = 10.0;
    this.pixelsPerMeter = canvas.width / visibleWorldWidth;
  }

  private createTube() {
    const M = this.mod;
    const bd = new M.b2BodyDef();
    bd.set_type(M.b2_staticBody);
    const tube = this.world.CreateBody(bd);

    const w = 0.3;
    const h = 0.06;
    const thickness = 0.01;

    const createWall = (cx: number, cy: number, hx: number, hy: number) => {
      const shape = new M.b2PolygonShape();
      shape.SetAsBox(hx, hy, new M.b2Vec2(cx + this.shootPoint.x, cy + this.shootPoint.y), 0);
      tube.CreateFixture(shape, 0);
      M.destroy(shape);
      this.tubeWalls.push({ cx: cx + this.shootPoint.x, cy: cy + this.shootPoint.y, hx, hy });
    };

    createWall(0, -h, w, thickness);
    createWall(0, h, w, thickness);
    createWall(-w, 0, thickness, h);

    M.destroy(bd);
  }

  private initParticleSystem() {
    const M = this.mod;
    const psd = new M.b2ParticleSystemDef();
    psd.radius = 0.006;
    psd.dampingStrength = 0.25;
    psd.viscousStrength = 0.25;

    this.particleSystem = this.world.CreateParticleSystem(psd);

    this.pd = new M.b2ParticleDef();
    this.pPos = new M.b2Vec2(0, 0);
    this.pVel = new M.b2Vec2(0, 0);

    this.pd.position = this.pPos;
    this.pd.velocity = this.pVel;
    this.pd.flags = M.b2_waterParticle;

    M.destroy(psd);
  }

  private emitWater(dt: number) {
    const jitter = 0.05;
    const count = this.particleSystem.GetParticleCount();

    const desired = this.emitRate * dt + this.emitAccumulator;
    let particlesToEmit = Math.floor(desired);
    this.emitAccumulator = desired - particlesToEmit;

    if (particlesToEmit <= 0) return;

    if (count + particlesToEmit > this.maxParticles) {
      const overflow = count + particlesToEmit - this.maxParticles;
      for (let i = overflow - 1; i >= 0; i--) {
        this.particleSystem.DestroyParticle(i);
      }
    }

    for (let i = 0; i < particlesToEmit; i++) {
      this.pPos.Set(
        this.shootPoint.x + (Math.random() - 0.5) * jitter,
        this.shootPoint.y + (Math.random() - 0.5) * jitter
      );

      this.pVel.Set(
        this.shootDir.x * this.shootSpeed,
        this.shootDir.y * this.shootSpeed
      );

      this.pd.position = this.pPos;
      this.pd.velocity = this.pVel;
      this.particleSystem.CreateParticle(this.pd);
    }
  }

  public setGravity(x: number, y: number) {
    this.gravity.Set(x, y);
    this.world.SetGravity(this.gravity);
  }

  private setWorldToCanvas() {
    const ctx = this.ctx;
    const w = this.canvasRef.nativeElement.width;
    const h = this.canvasRef.nativeElement.height;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.translate(w / 2, h / 2);
    ctx.scale(this.pixelsPerMeter, -this.pixelsPerMeter);
  }

  private draw() {
    const ctx = this.ctx;
    const canvas = this.canvasRef.nativeElement;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.setWorldToCanvas();

    const M = this.mod;
    const posBuf = this.particleSystem.GetPositionBuffer();
    const basePtr = M.getPointer(posBuf);
    const count = this.particleSystem.GetParticleCount();
    const r = this.particleSystem.GetRadius();

    ctx.fillStyle = '#3db2ff';
    ctx.beginPath();

    for (let i = 0; i < count; i++) {
      const p = basePtr + i * 8;
      const x = M.HEAPF32[p >> 2];
      const y = M.HEAPF32[(p + 4) >> 2];
      ctx.moveTo(x + r, y);
      ctx.arc(x, y, r, 0, Math.PI * 2);
    }

    ctx.fill();
  }

  set_gravity(val: number) {
    this.gravity.Set(this.gravity.x, val * 10);
    this.world.SetGravity(this.gravity);
    console.log('Gravity set to:', this.gravity.x, this.gravity.y);
  }

  start_hose() {
    if (!this.on) {
      this.on = true;
      this.emitAccumulator = 0;
      this.gravity.Set(-1, this.gravity.y);
      this.world.SetGravity(this.gravity);

      if (this.valve_sound) {
        this.valve_sound.currentTime = 0;
        this.valve_sound.play();
      }

      window.setTimeout(() => {
        if (this.spray_sound) {
          this.spray_sound.currentTime = 0;
          this.spray_sound.play();
        }
        this.spraying = true;
      }, 500);
    } else {
      this.on = false;

      if (this.valve_sound) {
        this.valve_sound.currentTime = 0;
        this.valve_sound.play();
      }

      window.setTimeout(() => {
        this.spraying = false;
        this.emitAccumulator = 0;

        if (this.spray_sound) {
          this.spray_sound.pause();
          this.spray_sound.currentTime = 0;
        }

        this.gravity.Set(1, this.gravity.y);
        this.world.SetGravity(this.gravity);
      }, 200);
    }
  }

  clear_water() {
    return;
  }

  private mute_audio(value: boolean) {
    if (this.spray_sound) this.spray_sound.muted = value;
    if (this.valve_sound) this.valve_sound.muted = value;
  }
}