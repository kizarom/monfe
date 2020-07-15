import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterCommandeComponent } from './filter-commande.component';

describe('FilterCommandeComponent', () => {
  let component: FilterCommandeComponent;
  let fixture: ComponentFixture<FilterCommandeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterCommandeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterCommandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
