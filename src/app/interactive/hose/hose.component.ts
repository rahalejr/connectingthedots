import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimulationService } from '../../services/simulation.service';

@Component({
selector: 'hose',
standalone: true,
imports: [CommonModule],
templateUrl: './hose.component.html',
styleUrls: ['./hose.component.css']
})
export class HoseComponent implements AfterViewInit, OnDestroy {
@ViewChild('cv', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

loading = true;
error?: string;
mod?: any;

// Box2D
private world: any;
private earth: any;
private moon: any;
private particleSystem: any;
private forceVec!: any;

// Render
private ctx!: CanvasRenderingContext2D;
private raf = 0;
private pixelsPerMeter = 160;

// Camera (co-rotating so the pair looks stationary)
private angle = 0;
private bary = { x: 0, y: 0 };
private coRotate = false; // set false if you want to see the orbit move on screen

// Simple sim parameters (no real-world scaling)
private Gs = 1.0;                 // simulation gravity constant (try 0.8–1.5)
private earthR = 0.8;
private moonR = 0.27 * this.earthR;
private moonDist = 10.0 * this.earthR; // separation

// Particles (water)
private particleRadius = 0.02;
private particleCount = 400;
private particleMass = 0.002;     // sim mass for gravity calc
private moonGravityBoost = 18;    // exaggerate particle tides only

ngOnDestroy() {
cancelAnimationFrame(this.raf);
}

constructor(
private sim: SimulationService,
@Inject(PLATFORM_ID) private platformId: Object
) {}

async ngAfterViewInit() {
if (!isPlatformBrowser(this.platformId)) {
this.loading = false;
return;
}

try {
  // Canvas
  const canvas = this.canvasRef.nativeElement;
  this.ctx = canvas.getContext('2d')!;
  this.resizeCanvas(canvas);
  addEventListener('resize', () => this.resizeCanvas(canvas));

  // Load LiquidFun
  this.mod = await this.sim.load();

  // World
  this.world = new this.mod.b2World(new this.mod.b2Vec2(0, 0));
  this.forceVec = new this.mod.b2Vec2(0, 0);

  this.initBodies();
  this.initParticles();

  // Loop
  let last = performance.now();
  const tick = (t: number) => {
    const dt = Math.min(0.033, Math.max(0.001, (t - last) / 1000));
    last = t;

    this.applyBodyGravity();
    this.applyParticleGravity();

    // More particle iterations helps the water
    this.world.Step(dt, 8, 3, 5);

    // this.updateCamera();
    this.draw();

    this.raf = requestAnimationFrame(tick);
  };
  this.raf = requestAnimationFrame(tick);
} catch (e: any) {
  this.error = e?.message || String(e);
  console.error(e);
} finally {
  this.loading = false;
}
}

// ---------- init ----------

private resizeCanvas(canvas: HTMLCanvasElement) {
const dpr = Math.max(1, window.devicePixelRatio || 1);
const rect = canvas.getBoundingClientRect();
const w = rect.width || 800;
const h = rect.height || 600;
canvas.width = Math.round(w * dpr);
canvas.height = Math.round(h * dpr);
}

private initBodies() {
const M = this.mod;
const b2_dynamicBody = M.b2_dynamicBody;

const bdE = new M.b2BodyDef(); bdE.set_type(b2_dynamicBody);
const bdM = new M.b2BodyDef(); bdM.set_type(b2_dynamicBody);

// Small damping helps keep numerical drift under control
bdE.set_linearDamping(0.00);
bdM.set_linearDamping(0.00);

const shapeE = new M.b2CircleShape(); shapeE.set_m_radius(this.earthR);
const shapeM = new M.b2CircleShape(); shapeM.set_m_radius(this.moonR);

this.earth = this.world.CreateBody(bdE);
this.moon  = this.world.CreateBody(bdM);

// SAME density for both => inertial mass ratio = area ratio (~13.7:1). Stable and sane.
const density = 1.0;
this.earth.CreateFixture(shapeE, density);
this.moon.CreateFixture(shapeM, density);

// Positions
const earthPos = { x: -0.5, y: 0 };
const moonPos  = { x: earthPos.x + this.moonDist, y: earthPos.y };

const v = new M.b2Vec2(0, 0);
v.Set(earthPos.x, earthPos.y); this.earth.SetTransform(v, 0);
v.Set(moonPos.x,  moonPos.y);  this.moon.SetTransform(v, 0);
M.destroy(v);

// Gravitational masses = inertial masses from Box2D (area*density)
const Me = this.earth.GetMass();
const Mm = this.moon.GetMass();
(this.earth as any).__gm = Me;
(this.moon  as any).__gm = Mm;

// Circular-orbit speeds (no scaling)
const R = this.moonDist;
const vrel = Math.sqrt(this.Gs * (Me + Mm) / R);
const vE = vrel * (Mm / (Me + Mm));
const vM = vrel * (Me / (Me + Mm));

// Tangent direction (perpendicular to Earth→Moon)
const rx = moonPos.x - earthPos.x;
const ry = moonPos.y - earthPos.y;
const rlen = Math.hypot(rx, ry) || 1;
const tx = -ry / rlen;
const ty =  rx / rlen;

// Set initial velocities
this.earth.SetLinearVelocity(new M.b2Vec2(-tx * vE, -ty * vE));
this.moon.SetLinearVelocity(new M.b2Vec2( tx * vM,  ty * vM));
const eV = this.earth.GetLinearVelocity();
const mV = this.moon.GetLinearVelocity();
eV.op_mul(0.5); mV.op_mul(.98);
this.earth.SetLinearVelocity(eV);
this.moon.SetLinearVelocity(mV);


// Cleanup
M.destroy(shapeE); M.destroy(shapeM);
M.destroy(bdE);    M.destroy(bdM);
}

private initParticles() {
const M = this.mod;

const psd = new M.b2ParticleSystemDef();
psd.radius = this.particleRadius;
psd.dampingStrength = 0.25;
psd.viscousStrength = 0.25;
psd.surfaceTensionPressureStrength = 0.2;
psd.surfaceTensionNormalStrength = 0.2;
this.particleSystem = this.world.CreateParticleSystem(psd);

const e = this.earth.GetPosition();
const ringR = this.earthR + this.particleRadius * 1.4;

let indx = 0;

setInterval(() => {
  for (let i = 0; i < 1000; i++) {

  let radz = ringR + .2

  const a = (i / this.particleCount) * Math.PI * 2;
  const x = e.x + (radz * Math.cos(a));
  const y = e.y + (radz * Math.sin(a));


  const pd = new M.b2ParticleDef();
  pd.flags = M.b2_waterParticle;
  pd.position = new M.b2Vec2(x, y);
  this.particleSystem.CreateParticle(pd);
  M.destroy(pd.position);
  M.destroy(pd);

  }
}, 3000)

M.destroy(psd);
}

// ---------- forces ----------

private applyBodyGravity() {
  const pE = this.earth.GetPosition();
  const pM = this.moon.GetPosition();
  
  const rx = pM.x - pE.x;
  const ry = pM.y - pE.y;
  
  const r2 = Math.max(1e-5, rx * rx + ry * ry);
  const rinv = 1 / Math.sqrt(r2);
  const nx = rx * rinv;   // direction Earth -> Moon
  const ny = ry * rinv;
  
  const Me = (this.earth as any).__gm;  // use Box2D masses you stored
  const Mm = (this.moon  as any).__gm;
  
  const fMag = this.Gs * Me * Mm / r2;
  
  // Earth should be pulled toward Moon: +nx, +ny
  this.forceVec.Set(nx * fMag, ny * fMag);
  this.earth.ApplyForce(this.forceVec, this.earth.GetWorldCenter());
  
  // Moon should be pulled toward Earth: -nx, -ny
  this.forceVec.Set(-nx * fMag, -ny * fMag);
  this.moon.ApplyForce(this.forceVec, this.moon.GetWorldCenter());
  }

private applyParticleGravity() {
const M = this.mod;
const posBuf = this.particleSystem.GetPositionBuffer();
const basePtr = M.getPointer(posBuf);
const count = this.particleSystem.GetParticleCount();

const pE = this.earth.GetPosition();
const pM = this.moon.GetPosition();
const Me = (this.earth as any).__gm;
const Mm = (this.moon  as any).__gm;
const mP = this.particleMass;

const F = this.forceVec;

for (let i = 0; i < count; i++) {
  const p = basePtr + i * 8;
  const x = M.HEAPF32[p >> 2];
  const y = M.HEAPF32[(p + 4) >> 2];

  let fx = 0, fy = 0;

  // Earth pull
  {
    const rx = pE.x - x, ry = pE.y - y;
    const r2 = Math.max(1e-5, rx * rx + ry * ry);
    const rinv = 1 / Math.sqrt(r2);
    const fMag = this.Gs * Me * mP / r2;
    fx += rx * rinv * fMag;
    fy += ry * rinv * fMag;
  }
  // Moon pull (boosted for visible tides)
  {
    const rx = pM.x - x, ry = pM.y - y;
    const r2 = Math.max(1e-5, rx * rx + ry * ry);
    const rinv = 1 / Math.sqrt(r2);
    const fMag = this.moonGravityBoost * (this.Gs * Mm * mP / r2);
    fx += rx * rinv * fMag;
    fy += ry * rinv * fMag;
  }

  // Clamp
  const mag = Math.hypot(fx, fy);
  const maxF = 200;
  if (mag > maxF) { fx = fx / mag * maxF; fy = fy / mag * maxF; }

  F.Set(fx, fy);
  this.particleSystem.ParticleApplyForce(i, F);
}
}

// ---------- camera + draw ----------

private updateCamera() {
const pE = this.earth.GetPosition();
const pM = this.moon.GetPosition();

if (this.coRotate) {
  this.angle = Math.atan2(pM.y - pE.y, pM.x - pE.x);
} else {
  this.angle = 0;
}

const Me = (this.earth as any).__gm;
const Mm = (this.moon  as any).__gm;
const inv = 1 / (Me + Mm);
this.bary.x = (Me * pE.x + Mm * pM.x) * inv;
this.bary.y = (Me * pE.y + Mm * pM.y) * inv;
}

private setWorldToCanvas() {
const ctx = this.ctx;
const w = this.canvasRef.nativeElement.width;
const h = this.canvasRef.nativeElement.height;

ctx.setTransform(1, 0, 0, 1, 0, 0);
ctx.translate(w / 2, h / 2);
ctx.scale(this.pixelsPerMeter, -this.pixelsPerMeter);
ctx.rotate(-this.angle);
ctx.translate(-this.bary.x, -this.bary.y);
}

private draw() {
const ctx = this.ctx;
const canvas = this.canvasRef.nativeElement;

ctx.setTransform(1, 0, 0, 1, 0, 0);
ctx.clearRect(0, 0, canvas.width, canvas.height);

this.setWorldToCanvas();

// Earth & Moon
const ePos = this.earth.GetPosition();
const mPos = this.moon.GetPosition();

ctx.lineWidth = 1 / this.pixelsPerMeter;

ctx.fillStyle = '#2b3c6f';
ctx.strokeStyle = '#89a2ff';
ctx.beginPath();
ctx.arc(ePos.x, ePos.y, this.earthR, 0, Math.PI * 2);
ctx.fill();
ctx.stroke();

ctx.fillStyle = '#777';
ctx.strokeStyle = '#ddd';
ctx.beginPath();
ctx.arc(mPos.x, mPos.y, this.moonR, 0, Math.PI * 2);
ctx.fill();
ctx.stroke();

// Water
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