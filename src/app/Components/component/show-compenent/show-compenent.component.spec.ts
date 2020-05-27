import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowCompenentComponent } from './show-compenent.component';

describe('ShowCompenentComponent', () => {
  let component: ShowCompenentComponent;
  let fixture: ComponentFixture<ShowCompenentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowCompenentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowCompenentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
