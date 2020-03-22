import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLawComponent } from './admin-law.component';

describe('AdminLawComponent', () => {
  let component: AdminLawComponent;
  let fixture: ComponentFixture<AdminLawComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminLawComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminLawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
