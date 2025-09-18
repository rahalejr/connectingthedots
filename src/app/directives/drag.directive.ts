import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[drag]',
  standalone: true
})
export class DragDirective {
  @Input() range: number[] = [0, 100];
  @Input() svg!: SVGSVGElement;
  @Input() direction: 'x' | 'y' = 'x';
  @Input() axis_constant = 0;

  @Output() coordinate = new EventEmitter<number>();
  @Output() pixels = new EventEmitter<number[]>();

  private dragging = false;
  private default = 50;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit() {
    const initCoords = this.direction == 'x' ? this.svgToClient(this.default, this.axis_constant) : this.svgToClient(this.axis_constant, this.default);
    if (initCoords) {
        this.pixels.emit([initCoords.x, initCoords.y]);
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

    const pt = this.svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = this.svg.getScreenCTM();
    if (!ctm) return;
    const svgCoords = pt.matrixTransform(ctm.inverse());

    let val: number;
    let fixedX: number;
    let fixedY: number;

    if (this.direction === 'x') {
      val = Math.min(Math.max(svgCoords.x, this.range[0]), this.range[1]);
      fixedX = val;
      fixedY = this.axis_constant;
    } else {
      val = Math.min(Math.max(-svgCoords.y, this.range[0]), this.range[1]);
      fixedX = this.axis_constant;
      fixedY = val;
    }

    this.coordinate.emit(val);

    const fixedPt = new DOMPoint(fixedX, fixedY).matrixTransform(ctm);
    this.pixels.emit([fixedPt.x, fixedPt.y]);
  }

  svgToClient(x: number, y: number) {
    const ctm = this.svg.getScreenCTM();
    if (!ctm) return null;
    const pt = new DOMPoint(x, y);
    const res = pt.matrixTransform(ctm);
    return { x: res.x, y: res.y };
  }
}
