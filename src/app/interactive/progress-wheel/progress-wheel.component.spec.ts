import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressWheelComponent } from './progress-wheel.component';

describe('ProgressWheelComponent', () => {
  let component: ProgressWheelComponent;
  let fixture: ComponentFixture<ProgressWheelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressWheelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProgressWheelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
