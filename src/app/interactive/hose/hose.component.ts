import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { SimulationService } from '../../services/simulation.service';

@Component({
    selector: 'hose',
    imports: [CommonModule],
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

  private pd: any;
  private pPos: any;
  private pVel: any;

  // Gravity control
  private gravity = { x: -1, y: 5 };

  // Water stream
  private shootPoint = { x: 0, y: 1 };
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

    // Load LiquidFun
    this.mod = await this.sim.load();

    // Create world
    this.world = new this.mod.b2World(new this.mod.b2Vec2(this.gravity.x, this.gravity.y));

    // Initialize tube & particles
    this.createTube();
    this.initParticleSystem();

    // Loop
    let last = performance.now();
    const tick = (t: number) => {
      const dt = Math.min(0.033, Math.max(0.001, (t - last) / 1000));
      last = t;

      this.emitWater();
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
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
  }

  // ---------- Tube (static enclosure) ----------
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

  private maxParticles = 3000;

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

    // tube
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 0.01;

    for (const wall of this.tubeWalls) {
      ctx.beginPath();
      ctx.rect(wall.cx - wall.hx, wall.cy - wall.hy, wall.hx * 2, wall.hy * 2);
      ctx.fill();
      ctx.stroke();
    }

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
}
