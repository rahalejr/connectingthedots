import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';

@Component({
    selector: 'slider',
    imports: [],
    templateUrl: './slider.component.html',
    styleUrl: './slider.component.css'
})
export class SliderComponent {

  value = 50;
  @Output() valueChange = new EventEmitter<number>();

  @ViewChild('track') track!: ElementRef;

  dragging = false;

  startDrag(event: MouseEvent | TouchEvent) {
    this.dragging = true;
    event.stopPropagation();
    event.preventDefault();
  }

  onTrackClick(event: MouseEvent | TouchEvent) {

    if (event.target instanceof HTMLElement && event.target.classList.contains('slider-handle')) {
      return;
    }

    this.update_value(event);
  }

  @HostListener('document:mousemove', ['$event'])
  @HostListener('document:touchmove', ['$event'])
  onMove(event: MouseEvent | TouchEvent) {
    if (!this.dragging) return;
    this.update_value(event);
  }

  @HostListener('document:mouseup')
  @HostListener('document:touchend')
  endDrag() {
    this.dragging = false;
  }

  update_value(event: any) {
    const rect = this.track.nativeElement.getBoundingClientRect();
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;
  
    let percent = ((rect.bottom - clientY) / rect.height) * 100;
    percent = Math.max(0, Math.min(100, percent));
  
    const oldValue = this.value;
    this.value = percent;
  
    const step = 5;
    const oldSnap = Math.floor(oldValue / step);
    const newSnap = Math.floor(percent / step);
  
    if (newSnap !== oldSnap) {
      this.valueChange.emit(newSnap * step);
    }
  }

}
