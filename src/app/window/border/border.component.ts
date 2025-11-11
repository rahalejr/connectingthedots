import { AfterViewInit, Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { CommonModule } from '@angular/common';
import { ConnectionComponent } from '../../interface/connection/connection.component';

@Component({
    selector: 'border',
    imports: [CommonModule, ConnectionComponent],
    templateUrl: './border.component.html',
    styleUrl: './border.component.css'
})
export class BorderComponent implements AfterViewInit {
  @ViewChildren('iconimg', { read: ElementRef }) images!: QueryList<ElementRef>;
  @ViewChildren('section', { read: ElementRef }) sections!: QueryList<ElementRef>;
  @ViewChildren(ConnectionComponent) connections!: QueryList<ConnectionComponent>;
  @ViewChild('background', { read: ElementRef }) bg!: ElementRef;
  sections_array: ElementRef[] = [];
  connections_array: ConnectionComponent[] = [];
  state: 'state1' | 'state2' = 'state1';
  started = false;


  constructor(public navigation: NavigationService) {}

  ngOnInit() {
    this.navigation.started$.subscribe(value => {
      this.started = value;
      console.log('subbed');
      this.state = this.state == 'state1' ? 'state2' : 'state1';
      this.images?.forEach(img => img.nativeElement.style.animationPlayState = 'paused');
      setTimeout(() => {
        this.images?.forEach(img => img.nativeElement.classList.add('reset'));
        setTimeout(()=> {this.navigation.nextSlide()}, 1700);
      }, 300);
    });

    this.navigation.current_slide$.subscribe(value => {
      console.log(value);
      let slide = value;
      let current = this.connections_array[slide-1];
      current.from = this.sections_array[slide-1];
      current.to = this.sections_array[slide];
      current.container = this.bg;
      current.updateLine();
      // current.updateLine().then(() => {
      //   this.navigation.nextSlide();
      // });
    })
  }


  ngAfterViewInit(): void {
    // this.animate_wobble();
    this.sections_array = this.sections.toArray();
    this.connections_array = this.connections.toArray();
  }

  animate_wobble(): void {
    const elements = this.images.toArray();
    let index = 0;

    const interval = setInterval(() => {
      if (this.started || index >= elements.length) {
        clearInterval(interval);
      }
      else if (index % 2 == 0) {
        elements[index].nativeElement.classList.add('wobble');
      }
      else {
        elements[index].nativeElement.classList.add('anti-wobble');
      }
      index++;
  }, 1000);}

}
