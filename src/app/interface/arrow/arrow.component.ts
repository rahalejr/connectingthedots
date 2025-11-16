import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'arrow',
    imports: [],
    templateUrl: './arrow.component.html',
    styleUrl: './arrow.component.css'
})
export class ArrowComponent {

  @Input() label: string = 'Next';
  @Input() show: boolean = true;

  @Output() clicked = new EventEmitter<void>();

  onClick() {this.clicked.emit()}

}
