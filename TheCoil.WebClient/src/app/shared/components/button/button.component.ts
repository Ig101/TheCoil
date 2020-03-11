import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ComponentSizeEnum } from '../../models/enum/component-size.enum';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

  @Input() disabled;
  @Input() type;
  @Input() size: ComponentSizeEnum = ComponentSizeEnum.Medium;

  componentSizeEnum = ComponentSizeEnum;

  @ViewChild('button') button: ElementRef;

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
