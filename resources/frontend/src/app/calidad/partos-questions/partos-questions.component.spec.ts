import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartosQuestionsComponent } from './partos-questions.component';

describe('PartosQuestionsComponent', () => {
  let component: PartosQuestionsComponent;
  let fixture: ComponentFixture<PartosQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartosQuestionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartosQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
