import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Button1Component } from './button1.component';

describe('Button1Component', () => {
  let component: Button1Component;
  let fixture: ComponentFixture<Button1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Button1Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Button1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
