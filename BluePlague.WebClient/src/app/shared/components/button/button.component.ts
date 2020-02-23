import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

  focused = false;
  entered = false;

  constructor() { }

  ngOnInit(): void {
  }

  click() {
    console.log('la');
  }
}
