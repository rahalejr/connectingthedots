import { Component } from '@angular/core';

@Component({
  selector: 'beakers',
  standalone: true,
  imports: [],
  templateUrl: './beakers.component.html',
  styleUrl: './beakers.component.css'
})
export class BeakersComponent {

  // rotationAngle = 0;

  // ngOnInit() {
  //   setInterval(() => {
  //     if (this.rotationAngle < 15) {  // Limit rotation to 15 degrees as an example
  //       this.rotationAngle += 0.5;
  //     }
  //   }, 30);
  // }

  // get rotationTransform() {
  //   // Tilt right around pivot (bottom middle). Adjust pivot location accordingly.
  //   return `rotate(${this.rotationAngle}, 200, 280)`;
  // }

  // // This includes top edge for clipping (MUST REMAIN closed)
  // beaker1ClipPath = `
  //   M 40,80
  //   L 140,80
  //   L 140,260
  //   Q 140,280 120,280
  //   L 60,280
  //   Q 40,280 40,260
  //   Z
  // `;
  // beaker2ClipPath = `
  //   M 200,150
  //   L 300,150
  //   L 300,260
  //   Q 300,280 280,280
  //   L 220,280
  //   Q 200,280 200,260
  //   Z
  // `;

  // // This EXCLUDES the top edge (no line drawn visually at the top)
  // beaker1OutlinePath = `
  //   M 140,80
  //   L 140,260
  //   Q 140,280 120,280
  //   L 60,280
  //   Q 40,280 40,260
  //   L 40,80
  // `;

  // beaker2OutlinePath = `
  //   M 300,150
  //   L 300,260
  //   Q 300,280 280,280
  //   L 220,280
  //   Q 200,280 200,260
  //   L 200,150
  // `;

}