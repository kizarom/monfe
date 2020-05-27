import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCompenentComponent } from './add-compenent.component';

describe('AddCompenentComponent', () => {
  let component: AddCompenentComponent;
  let fixture: ComponentFixture<AddCompenentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCompenentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCompenentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
