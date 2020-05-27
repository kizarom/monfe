import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListGammesComponent } from './list-gammes.component';

describe('ListGammesComponent', () => {
  let component: ListGammesComponent;
  let fixture: ComponentFixture<ListGammesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListGammesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListGammesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
