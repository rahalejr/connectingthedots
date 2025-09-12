import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TidalComponent } from './tidal.component';

describe('TidalComponent', () => {
  let component: TidalComponent;
  let fixture: ComponentFixture<TidalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TidalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TidalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
