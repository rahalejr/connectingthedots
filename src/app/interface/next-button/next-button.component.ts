import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
    selector: 'next-button',
    imports: [NgClass],
    templateUrl: './next-button.component.html',
    styleUrl: './next-button.component.css'
})
export class NextButtonComponent {

  @Input() label: string = 'Next';
  @Input() show: boolean = true;

  @Output() clicked = new EventEmitter<void>();

  onClick() {this.clicked.emit()}

}
