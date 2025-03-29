import { Component, Input } from '@angular/core';

@Component({
  selector: 'slide',
  standalone: true,
  imports: [],
  templateUrl: './slide.component.html',
  styleUrl: './slide.component.css'
})
export class SlideComponent {

  @Input() page: number = 1;

}
