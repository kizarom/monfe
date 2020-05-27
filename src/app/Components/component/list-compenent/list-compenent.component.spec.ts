import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCompenentComponent } from './list-compenent.component';

describe('ListCompenentComponent', () => {
  let component: ListCompenentComponent;
  let fixture: ComponentFixture<ListCompenentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCompenentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCompenentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
