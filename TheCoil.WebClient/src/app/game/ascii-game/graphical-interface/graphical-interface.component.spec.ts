import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicalInterfaceComponent } from './graphical-interface.component';

describe('GraphicalInterfaceComponent', () => {
  let component: GraphicalInterfaceComponent;
  let fixture: ComponentFixture<GraphicalInterfaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphicalInterfaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphicalInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
