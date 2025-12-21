import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindMyAgent } from './find-my-agent';

describe('FindMyAgent', () => {
  let component: FindMyAgent;
  let fixture: ComponentFixture<FindMyAgent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindMyAgent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindMyAgent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
