import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
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
    console.log('get');
    return this.log;
  }

  log: LogItem[];

  maxLogItems = 20;

  constructor(private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    this.logSubject.subscribe((value) => {
      this.log = value.slice(value.length - this.maxLogItems);
      this.changeDetector.detectChanges();
    });
  }

}
