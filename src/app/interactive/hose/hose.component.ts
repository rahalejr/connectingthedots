import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { SimulationService } from '../../services/simulation.service';
import { SliderComponent } from '../../interface/slider/slider.component';

@Component({
    selector: 'hose',
    imports: [CommonModule, SliderComponent],
    templateUrl: './hose.component.html',
    styleUrl: './hose.component.css'
})
export class HoseComponent implements AfterViewInit, OnDestroy {
  @ViewChild('cv', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private world: any;
  private particleSystem: any;
  private mod: any;
  private ctx!: CanvasRenderingContext2D;
  private raf = 0;
  private pixelsPerMeter = 160;

  on = false;
  spraying = false;

  private pd: any;
  private pPos: any;
  private pVel: any;
  private gravity: any;
  private shootPoint = { x: -2, y: .3 };
  private shootDir = { x: 1, y: 0 };
  private shootSpeed = 20;

  private tubeWalls: { cx: number; cy: number; hx: number; hy: number }[] = [];

  constructor(private sim: SimulationService, @Inject(PLATFORM_ID) private platformId: Object) {}

  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resizeCanvas(canvas);
    addEventListener('resize', () => this.resizeCanvas(canvas));

    this.mod = await this.sim.load();
    this.gravity = new this.mod.b2Vec2(-1, 0);
    this.world = new this.mod.b2World(this.gravity);

    this.createTube();
    this.initParticleSystem();

    // world loop
    let last = performance.now();
    const tick = (t: number) => {
      const dt = Math.min(0.033, Math.max(0.001, (t - last) / 1000));
      last = t;

      if (this.spraying) {this.emitWater()}
      this.world.Step(dt, 8, 3, 5);
      this.draw();

      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.raf);
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
  
    const w = .3, h = .06;
    const thickness = 0.01;
  
    const createWall = (cx: number, cy: number, hx: number, hy: number) => {
      const shape = new M.b2PolygonShape();
      shape.SetAsBox(hx, hy, new M.b2Vec2(cx + this.shootPoint.x, cy + this.shootPoint.y), 0);
      tube.CreateFixture(shape, 0);
      M.destroy(shape);
      this.tubeWalls.push({cx: cx + this.shootPoint.x, cy: cy + this.shootPoint.y, hx, hy});
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
    this.pd = new this.mod.b2ParticleDef();
    this.pPos = new this.mod.b2Vec2(0, 0);
    this.pVel = new this.mod.b2Vec2(0, 0);

    this.pd.position = this.pPos;
    this.pd.velocity = this.pVel;
    this.pd.flags = this.mod.b2_waterParticle;
    M.destroy(psd);
  }

  private maxParticles = 2500;

  private emitWater() {
    const particlesPerFrame = 50;
    const count = this.particleSystem.GetParticleCount();
    const jitter = 0.05;
  
    if (count > this.maxParticles) {
      const overflow = count - this.maxParticles + particlesPerFrame; 
      const safeDeleteCount = Math.min(overflow, count);
  
      for (let i = 0; i < safeDeleteCount; i++) {this.particleSystem.DestroyParticle(i)}
    }

    for (let i = 0; i < particlesPerFrame; i++) {
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
    this.gravity.x = x;
    this.gravity.y = y;
    this.world.SetGravity(new this.mod.b2Vec2(x, y));
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

    // // tube
    // ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    // ctx.strokeStyle = '#ffffff';
    // ctx.lineWidth = 0.01;

    // for (const wall of this.tubeWalls) {
    //   ctx.beginPath();
    //   ctx.rect(wall.cx - wall.hx, wall.cy - wall.hy, wall.hx * 2, wall.hy * 2);
    //   ctx.fill();
    //   ctx.stroke();
    // }

    // particles
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
    console.log(val);
    this.gravity.Set(this.gravity.x, val * 10);
    this.world.SetGravity(this.gravity);
  }

  start_hose() {
    if (!this.on) {
      this.on = true;
      setTimeout(() => {
        this.spraying = true;
      }, 1000);
    }
  }

}
