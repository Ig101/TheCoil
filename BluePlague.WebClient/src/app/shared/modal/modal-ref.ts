import { ComponentRef, ApplicationRef, EventEmitter } from '@angular/core';

import { Observable } from 'rxjs';
import { ModalShellComponent } from './modal-shell/modal-shell.component';
import { ModalComponent } from './modal-component.interface';

export class ModalRef<Tmodel, Tresult> {

  private closeEvent = new EventEmitter<Tresult>();
  model: Tmodel;

  constructor(private modalRef: ComponentRef<ModalShellComponent>,
              private componentRef: ComponentRef<ModalComponent<Tmodel, Tresult>>,
              private appRef: ApplicationRef) { }

  onCloseEvent(): Observable<Tresult> {
    return this.closeEvent.asObservable();
  }

  close(model: Tresult) {
    this.appRef.detachView(this.modalRef.hostView);
    this.closeEvent.emit(model);
    this.componentRef.destroy();
    this.componentRef.destroy();
    this.modalRef.destroy();
    const dialogs = document.body.querySelectorAll('app-modal-shell');
    if (dialogs.length > 1) {
      (dialogs.item(dialogs.length - 1) as HTMLElement).style.overflowY = null;
      (dialogs.item(dialogs.length - 1) as HTMLElement).style.overflowX = null;
    } else {
      (document.body as HTMLElement).style.overflowY = null;
      (document.body as HTMLElement).style.overflowX = null;
    }
  }
}
