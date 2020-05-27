import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPanelsComponent } from './list-panels.component';

describe('ListPanelsComponent', () => {
  let component: ListPanelsComponent;
  let fixture: ComponentFixture<ListPanelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPanelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPanelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
