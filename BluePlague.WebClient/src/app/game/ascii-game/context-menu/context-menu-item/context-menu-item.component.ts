import { Component, OnInit, Input } from '@angular/core';
import { ContextMenuItem } from 'src/app/game/ascii-game/models/context-menu-item.model';

@Component({
  selector: 'app-context-menu-item',
  templateUrl: './context-menu-item.component.html',
  styleUrls: ['./context-menu-item.component.scss']
})
export class ContextMenuItemComponent implements OnInit {

  @Input() item: ContextMenuItem;
  @Input() textHeight: number;

  constructor() { }

  ngOnInit() {
  }

}
