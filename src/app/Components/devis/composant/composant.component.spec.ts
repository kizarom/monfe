import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComposantComponent } from './composant.component';

describe('ComposantComponent', () => {
  let component: ComposantComponent;
  let fixture: ComponentFixture<ComposantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComposantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComposantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
