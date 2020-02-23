import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserManagementLoadingComponent } from './user-management-loading.component';

describe('UserManagementLoadingComponent', () => {
  let component: UserManagementLoadingComponent;
  let fixture: ComponentFixture<UserManagementLoadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserManagementLoadingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManagementLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
