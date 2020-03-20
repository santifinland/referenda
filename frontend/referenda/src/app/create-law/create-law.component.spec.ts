import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLawComponent } from './create-law.component';

describe('CreateLawComponent', () => {
  let component: CreateLawComponent;
  let fixture: ComponentFixture<CreateLawComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateLawComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
