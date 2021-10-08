import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrincipeComponent } from './principe.component';

describe('PrincipeComponent', () => {
  let component: PrincipeComponent;
  let fixture: ComponentFixture<PrincipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrincipeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrincipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
