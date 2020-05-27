import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCompenentComponent } from './edit-compenent.component';

describe('EditCompenentComponent', () => {
  let component: EditCompenentComponent;
  let fixture: ComponentFixture<EditCompenentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCompenentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCompenentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
