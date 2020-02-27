import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ContextMenuContext } from '../models/context-menu-context.model';
import { ContextMenuItemPage } from '../models/context-menu-item-page.model';
import { ContextMenuItem } from '../models/context-menu-item.model';
import { ContextMenuSystemTypesEnum } from '../models/enums/context-menu-system-types.enum';
import { EnginePlayerAction } from 'src/app/engine/models/engine-player-action.model';

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
export class ContextMenuComponent implements OnInit, OnDestroy {

  @ViewChild('contextMenu', { static: true }) contextMenu: ElementRef<HTMLDivElement>;
  @ViewChild('overlay', { static: true }) overlay: ElementRef<HTMLDivElement>;

  @Input() textHeight;
  @Input() set left(value: number) {
    this.leftInternal =  Math.max(125,
      Math.min(this.overlay.nativeElement.clientWidth - (125), value));
  }
  @Input() set top(value: number) {
    this.topInternal = Math.max(this.radius + this.textHeight * 2,
      Math.min(this.overlay.nativeElement.clientHeight - (this.radius + this.textHeight), value));
  }
  @Input() set context(value: ContextMenuContext) {
    if (value) {
      this.targetName = value.targetName;
      this.items.length = 0;
      let counter = this.pageSize;
      let pageNumber = -1;
      let page: ContextMenuItemPage;
      for (const action of value.actions) {
        if (action.success || action.reason) {
          if (counter >= this.pageSize) {
            counter = 0;
            page = {
              items: []
            } as ContextMenuItemPage;
            this.items.push(page);
            pageNumber++;
            if (pageNumber > 0) {
              const previousShift = this.calculateShifts(counter);
              page.items.push({
                systemType: ContextMenuSystemTypesEnum.Previous,
                action: {
                  character: '<',
                  name: $localize`:@@game.action.previous:previous page`
                },
                left: previousShift.left,
                top: previousShift.top,
                notAvailable: false,
                leftTooltip: previousShift.leftTooltip
              } as ContextMenuItem);
              counter++;

              const previousPage = this.items[pageNumber - 1];
              const moveItem = previousPage.items[this.pageSize - 1];
              previousPage.items[this.pageSize - 1] = {
                systemType: ContextMenuSystemTypesEnum.Next,
                action: {
                  character: '>',
                  name: $localize`:@@game.action.next:next page`
                },
                left: moveItem.left,
                top: moveItem.top,
                notAvailable: false,
                leftTooltip: moveItem.leftTooltip
              } as ContextMenuItem;

              const moveShift = this.calculateShifts(counter);
              moveItem.left = moveShift.left;
              moveItem.top = moveShift.top;
              moveItem.leftTooltip = moveShift.leftTooltip;
              page.items.push(moveItem);
              counter++;
            }
          }
          const shift = this.calculateShifts(counter);
          page.items.push({
            action: action.action,
            left: shift.left,
            top: shift.top,
            notAvailable: !action.success,
            notAvailableReason: action.reason,
            warning: action.warning,
            leftTooltip: shift.leftTooltip
          });
          counter++;
        }
      }
      if (this.items.length === 0) {
        const first = {
          items: []
        } as ContextMenuItemPage;
        this.items.push(first);
        const shift = this.calculateShifts(0);
        first.items.push({
          systemType: ContextMenuSystemTypesEnum.Nothing,
          action: {
            character: 'X',
            name: $localize`:@@game.action.no:nothing`
          },
          left: shift.left,
          top: shift.top,
          notAvailable: true,
          leftTooltip: shift.leftTooltip
        } as ContextMenuItem);
      }
    }
  }
  @Output() doAction = new EventEmitter<EnginePlayerAction>();

  pageSize = 8;

  targetName: string;
  items: ContextMenuItemPage[] = [];
  currentPage = 0;
  radius = 60;
  startAngle = Math.PI / this.pageSize + Math.PI / 2;

  inversion: boolean;

  preparedToExit: boolean[] = [];

  private leftInternal;
  private topInternal;

  get maxPage() {
    return this.items.length;
  }

  get currentItems() {
    return this.items[this.currentPage].items;
  }

  constructor() { }

  calculateShifts(position: number): {left: number, top: number, leftTooltip: boolean} {
    const angle = this.startAngle + position * Math.PI * 2 / this.pageSize;
    const cos = Math.cos(angle);
    return {
      left: this.radius * cos - 19,
      top: this.radius * Math.sin(angle) - 19,
      leftTooltip: (cos < 0 && this.leftInternal > 300) || this.leftInternal > this.overlay.nativeElement.clientWidth - 300
    };
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.doAction.unsubscribe();
  }

  getItemLeft(item: ContextMenuItem) {
    return Math.round(this.leftInternal + item.left);
  }

  getItemTop(item: ContextMenuItem) {
    return Math.round(this.topInternal + item.top);
  }

  getTargetLeft() {
    return this.leftInternal - 125;
  }

  getTargetTop() {
    return Math.round(this.topInternal - this.radius - this.textHeight * 2);
  }

  prepareExit(event: MouseEvent) {
    if (event.target !== event.currentTarget) {
      return;
    }
    this.preparedToExit[event.button] = true;
  }

  onExit(event: MouseEvent) {
    if (event.target !== event.currentTarget || !this.preparedToExit[event.button]) {
      return;
    }
    this.preparedToExit[event.button] = undefined;
    this.doAction.next(undefined);
  }

  onClick(event: ContextMenuItem) {
    if (event.systemType === ContextMenuSystemTypesEnum.Next) {
      this.currentPage++;
      return;
    }
    if (event.systemType === ContextMenuSystemTypesEnum.Previous) {
      this.currentPage--;
      return;
    }
    if (event.notAvailable) {
      return;
    }
    this.doAction.next(event.action);
  }

}
