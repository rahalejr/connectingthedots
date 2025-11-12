import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TidesTextComponent } from './tides-text.component';

describe('TidesTextComponent', () => {
  let component: TidesTextComponent;
  let fixture: ComponentFixture<TidesTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TidesTextComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TidesTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
