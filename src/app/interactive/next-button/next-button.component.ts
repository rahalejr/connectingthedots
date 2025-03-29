import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'next-button',
  standalone: true,
  imports: [],
  templateUrl: './next-button.component.html',
  styleUrl: './next-button.component.css'
})
export class NextButtonComponent {

  @Output() nextClicked = new EventEmitter<void>();

  onClick() {this.nextClicked.emit()}

}
