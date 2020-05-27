import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGammeComponent } from './add-gamme.component';

describe('AddGammeComponent', () => {
  let component: AddGammeComponent;
  let fixture: ComponentFixture<AddGammeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGammeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGammeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
