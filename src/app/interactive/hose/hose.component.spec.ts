import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoseComponent } from './hose.component';

describe('HoseComponent', () => {
  let component: HoseComponent;
  let fixture: ComponentFixture<HoseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HoseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HoseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
