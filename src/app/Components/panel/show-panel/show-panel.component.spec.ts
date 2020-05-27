import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowPanelComponent } from './show-panel.component';

describe('ShowPanelComponent', () => {
  let component: ShowPanelComponent;
  let fixture: ComponentFixture<ShowPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
