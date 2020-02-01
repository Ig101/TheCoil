import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsciiGameComponent } from './ascii-game.component';

describe('AsciiGameComponent', () => {
  let component: AsciiGameComponent;
  let fixture: ComponentFixture<AsciiGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsciiGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsciiGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
