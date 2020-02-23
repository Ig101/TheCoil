import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewGameStartComponent } from './new-game-start.component';

describe('NewGameStartComponent', () => {
  let component: NewGameStartComponent;
  let fixture: ComponentFixture<NewGameStartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewGameStartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewGameStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
