import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartMatchingComponent } from './chart_matching.component';

describe('ChartMatchingComponent', () => {
  let component: ChartMatchingComponent;
  let fixture: ComponentFixture<ChartMatchingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartMatchingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartMatchingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
