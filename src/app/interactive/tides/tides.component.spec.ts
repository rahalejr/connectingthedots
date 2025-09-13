import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TidesComponent } from './tides.component';

describe('TidesComponent', () => {
  let component: TidesComponent;
  let fixture: ComponentFixture<TidesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TidesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
