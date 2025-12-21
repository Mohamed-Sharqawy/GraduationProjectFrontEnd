import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Propertyview } from './propertyview';

describe('Propertyview', () => {
  let component: Propertyview;
  let fixture: ComponentFixture<Propertyview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Propertyview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Propertyview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
