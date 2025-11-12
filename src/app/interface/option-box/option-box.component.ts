import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'option-box',
  imports: [CommonModule],
  templateUrl: './option-box.component.html',
  styleUrl: './option-box.component.css'
})
export class OptionBoxComponent {

  @Input() options: string[] = [];

}
