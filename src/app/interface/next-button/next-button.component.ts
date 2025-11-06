import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'next-button',
    imports: [],
    templateUrl: './next-button.component.html',
    styleUrl: './next-button.component.css'
})
export class NextButtonComponent {

  @Input() label: string = 'Next';

  @Output() clicked = new EventEmitter<void>();

  onClick() {this.clicked.emit()}

}
