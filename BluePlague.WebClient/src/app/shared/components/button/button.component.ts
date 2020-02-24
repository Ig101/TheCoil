import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

  @Input() disabled;
  @Input() type;

  @Output() buttonClick = new EventEmitter<any>();

  focused = false;
  entered = false;

  constructor() { }

  ngOnInit(): void {
  }

  click() {
    this.buttonClick.emit();
  }
}
