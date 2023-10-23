import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListComponentCamas } from './list-camas.component';

describe('ListComponentCamas', () => {
  let component: ListComponentCamas;
  let fixture: ComponentFixture<ListComponentCamas>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListComponentCamas ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListComponentCamas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
