import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowGammeComponent } from './show-gamme.component';

describe('ShowGammeComponent', () => {
  let component: ShowGammeComponent;
  let fixture: ComponentFixture<ShowGammeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowGammeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowGammeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
