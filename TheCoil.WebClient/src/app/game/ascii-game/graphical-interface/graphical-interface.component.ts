import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { LogItem } from '../models/log-item.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-graphical-interface',
  templateUrl: './graphical-interface.component.html',
  styleUrls: ['./graphical-interface.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GraphicalInterfaceComponent implements OnInit {

  @Input() logSubject: Observable<LogItem[]>;

  get logView(): LogItem[] {
    return this.log;
  }

  log: LogItem[];

  maxLogItems = 10;

  @Output() guiMouseLeaveEvent = new EventEmitter<any>();

  constructor(private changeDetector: ChangeDetectorRef) { }

  stop(event: MouseEvent) {
    event.preventDefault();
  }

  stopPropagation(event: MouseEvent) {
    event.stopPropagation();
  }

  getItemOpacity(item: LogItem) {
    return Math.max(0, item.opacity);
  }
  ngOnInit() {
    this.logSubject.subscribe((value) => {
      this.log = value.slice(Math.max(0, value.length - this.maxLogItems));
      this.changeDetector.detectChanges();
    });
  }

}
