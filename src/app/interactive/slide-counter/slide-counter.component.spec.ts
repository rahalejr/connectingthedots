import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideCounterComponent } from './slide-counter.component';

describe('SlideCounterComponent', () => {
  let component: SlideCounterComponent;
  let fixture: ComponentFixture<SlideCounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlideCounterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SlideCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
