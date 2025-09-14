import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'arrow',
  standalone: true,
  imports: [],
  templateUrl: './arrow.component.html',
  styleUrl: './arrow.component.css'
})
export class ArrowComponent {

  @Input() label: string = 'Next';

  @Output() clicked = new EventEmitter<void>();

  onClick() {this.clicked.emit()}

}
