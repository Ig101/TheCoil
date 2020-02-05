import { Injectable } from '@angular/core';
import { WebCommunicationService } from 'src/app/shared/services/web-communication.service';
import { SmartActionBinding } from '../models/smart-action-binding.model';
import { of, Observable } from 'rxjs';

@Injectable()
export class GameSettingsService {

  smartActions: SmartActionBinding[];
  smartActionsKeyBindings: { [key: string]: SmartActionBinding; };

  constructor(
    private webCommunicationService: WebCommunicationService
  ) {
    this.smartActions = [
      {
        name: 'wait',
        xShift: 0,
        yShift: 0
      },
      {
        name: 'left',
        xShift: -1,
        yShift: 0
      },
      {
        name: 'leftTop',
        xShift: -1,
        yShift: -1
      },
      {
        name: 'top',
        xShift: 0,
        yShift: -1
      },
      {
        name: 'rightTop',
        xShift: 1,
        yShift: -1
      },
      {
        name: 'right',
        xShift: 1,
        yShift: 0
      },
      {
        name: 'rightBottom',
        xShift: 1,
        yShift: 1
      },
      {
        name: 'bottom',
        xShift: 0,
        yShift: 1
      },
      {
        name: 'leftBottom',
        xShift: -1,
        yShift: 1
      },
    ];
  }

  loadSettings(): Observable<{ [key: string]: SmartActionBinding; }> {
    if (this.smartActionsKeyBindings) {
      return of(this.smartActionsKeyBindings);
    }
    this.smartActionsKeyBindings = ({
      q: this.smartActions.find(x => x.name === 'leftTop'),
      w: this.smartActions.find(x => x.name === 'top'),
      e: this.smartActions.find(x => x.name === 'rightTop'),
      a: this.smartActions.find(x => x.name === 'left'),
      s: this.smartActions.find(x => x.name === 'bottom'),
      d: this.smartActions.find(x => x.name === 'right'),
      z: this.smartActions.find(x => x.name === 'leftBottom'),
      x: this.smartActions.find(x => x.name === 'wait'),
      c: this.smartActions.find(x => x.name === 'rightBottom'),
      7: this.smartActions.find(x => x.name === 'leftTop'),
      8: this.smartActions.find(x => x.name === 'top'),
      9: this.smartActions.find(x => x.name === 'rightTop'),
      4: this.smartActions.find(x => x.name === 'left'),
      2: this.smartActions.find(x => x.name === 'bottom'),
      6: this.smartActions.find(x => x.name === 'right'),
      1: this.smartActions.find(x => x.name === 'leftBottom'),
      5: this.smartActions.find(x => x.name === 'wait'),
      3: this.smartActions.find(x => x.name === 'rightBottom'),
      ArrowUp: this.smartActions.find(x => x.name === 'top'),
      ArrowLeft: this.smartActions.find(x => x.name === 'left'),
      ArrowDown: this.smartActions.find(x => x.name === 'bottom'),
      ArrowRight: this.smartActions.find(x => x.name === 'right'),
    });
    return of(this.smartActionsKeyBindings);
  }
}
