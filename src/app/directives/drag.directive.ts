import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[drag]',
  standalone: true
})
export class DragDirective {
  @Input() range: number[] = [0, 100];
  @Input() svg!: ElementRef;
  @Input() direction: 'x' | 'y' = 'x';
  @Input() axis_constant = 0;

  @Output() coordinate = new EventEmitter<number>();
  @Output() pixels = new EventEmitter<{x: number, y: number}>();

  private dragging = false;
  private default = 50;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit() {
    this.svg = this.svg.nativeElement;
    const initCoords = this.direction == 'x' ? this.svgToClient(this.default, this.axis_constant) : this.svgToClient(this.axis_constant, this.default);
    if (initCoords) {
        this.pixels.emit({x:initCoords.x, y:initCoords.y});
    }
  }

  ngOnInit() {
    this.default = (this.range[0] + this.range[1]) / 2;
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(e: MouseEvent) {
    this.dragging = true;
    e.preventDefault();
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    if (this.dragging) {
      this.dragging = false;
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
  if (!this.dragging || !this.svg) return;
  
  const svgEl = this.svg instanceof ElementRef ? this.svg.nativeElement : this.svg;
  if (!(svgEl instanceof SVGSVGElement)) return;
  
  const ctm = svgEl.getScreenCTM();
  if (!ctm) return;
  
  // client -> svg
  const svgPt = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
  
  let val: number;
  let fixedX: number;
  let fixedY: number;
  
  if (this.direction === 'x') {
  val = Math.min(Math.max(svgPt.x, this.range[0]), this.range[1]);
  fixedX = val;
  fixedY = this.axis_constant;
  } else {
  val = Math.min(Math.max(-svgPt.y, this.range[0]), this.range[1]);
  fixedX = this.axis_constant;
  fixedY = val;
  }
  
  this.coordinate.emit(val);
  
  // svg -> viewport
  const screenPt = new DOMPoint(fixedX, fixedY).matrixTransform(ctm);
  
  // viewport -> offsetParent (wrapper)
  const host = this.el.nativeElement as HTMLElement;
  const parent = (host.offsetParent as HTMLElement) ?? document.body;
  const parentRect = parent.getBoundingClientRect();
  
  this.pixels.emit({
  x: screenPt.x - parentRect.left,
  y: screenPt.y - parentRect.top
  });
  }

  svgToClient(x: number, y: number) {
    const svgEl = this.svg instanceof ElementRef ? this.svg.nativeElement : this.svg;
    if (!(svgEl instanceof SVGSVGElement)) return null;
    
    const ctm = svgEl.getScreenCTM();
    if (!ctm) return null;
    
    // svg -> viewport
    const screen = new DOMPoint(x, y).matrixTransform(ctm);
    
    // viewport -> offsetParent
    const host = this.el.nativeElement as HTMLElement;
    const parent = (host.offsetParent as HTMLElement) ?? document.body;
    const parentRect = parent.getBoundingClientRect();
    
    // If you’re not using CSS translate(-50%,-50%) on the handle,
    // subtract half host size here.
    return {
    x: screen.x - parentRect.left,
    y: screen.y - parentRect.top
    };
    }

}
