import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmersComponent } from './farmers.component';

describe('FarmersComponent', () => {
  let component: FarmersComponent;
  let fixture: ComponentFixture<FarmersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FarmersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FarmersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
