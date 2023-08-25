import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormComponentCamas } from './form-camas.component';

describe('FormComponentCamas', () => {
  let component: FormComponentCamas;
  let fixture: ComponentFixture<FormComponentCamas>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormComponentCamas ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormComponentCamas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
