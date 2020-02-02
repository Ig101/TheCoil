import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ContextMenuContext } from '../../models/context-menu-context.model';
import { ContextMenuItemPage } from '../../models/context-menu-item-page.model';
import { ContextMenuItem } from '../../models/context-menu-item.model';

/*
Variants:
1 page with 6 actions: all 6 actions on page
3 pages with 14 actions: 1 and 3 page: 5 actions, 2 page: 4 actions
*/
@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss', '../../game.module.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContextMenuComponent implements OnInit {

  @ViewChild('contextMenu', { static: true }) contextMenu: ElementRef<HTMLDivElement>;

  @Input() set context(value: ContextMenuContext) {
    if (value) {
      this.items = [];
      let counter = this.pageSize;
      let pageNumber = -1;
      let page: ContextMenuItemPage;
      for (const action of value.actions) {
        if (action.success || action.reason) {
          if (counter >= this.pageSize) {
            counter = 0;
            pageNumber++;
            page = {
              items: []
            } as ContextMenuItemPage;
            this.items.push(page);
          }
          page.items.push({
            type: action.action.type,
            notAvailableReason: action.reason,
            x: action.action.x,
            y: action.action.y
          } as ContextMenuItem);
          counter++;
        }
      }
    } else {
      this.items = undefined;
    }
  }
  @Input() textHeight;
  @Input() left;
  @Input() top;


  @Output() doAction = new EventEmitter<ContextMenuItem>();

  items: ContextMenuItemPage[];
  pageSize = 8;
  currentPage = 0;

  inversion: boolean;
  nextPageItem: ContextMenuItem;
  previousPageItem: ContextMenuItem;
  noActionItem: ContextMenuItem;

  get maxPage() {
    return this.items.length;
  }

  get currentItems() {
    return this.items.length > 0 ? this.items[this.currentPage].items : [];
  }

  constructor() { }

  ngOnInit() {
    this.previousPageItem = {
      type: 'previous page',
      x: 0,
      y: 0
    };
    this.nextPageItem = {
      type: 'next page',
      x: 0,
      y: 0
    };
    this.noActionItem = {
      type: 'no actions available',
      notAvailableReason: ['no actions available'],
      x: 0,
      y: 0
    };
  }

  onExit(event) {
    if (event.target !== event.currentTarget) {
      return;
    }
    this.doAction.next(undefined);
  }

}
