import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeakersComponent } from './beakers.component';

describe('BeakersComponent', () => {
  let component: BeakersComponent;
  let fixture: ComponentFixture<BeakersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeakersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BeakersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
