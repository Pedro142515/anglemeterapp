import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngleDisplayComponent } from './angle-display.component';

describe('AngleDisplayComponent', () => {
  let component: AngleDisplayComponent;
  let fixture: ComponentFixture<AngleDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AngleDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AngleDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
