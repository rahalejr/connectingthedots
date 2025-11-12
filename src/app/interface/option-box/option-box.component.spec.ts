import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionBoxComponent } from './option-box.component';

describe('OptionBoxComponent', () => {
  let component: OptionBoxComponent;
  let fixture: ComponentFixture<OptionBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptionBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
