import { Component, OnInit } from '@angular/core';
import { ModalRef } from '../modal-ref';

@Component({
  selector: 'app-modal-shell',
  templateUrl: './modal-shell.component.html',
  styleUrls: ['./modal-shell.component.scss']
})
export class ModalShellComponent implements OnInit {

  closeOnOverlayClick = true;
  ref: ModalRef<unknown, unknown>;

  constructor() { }

  ngOnInit() {
  }

  closeDialogOnOverlay(event: any) {
    if (this.closeOnOverlayClick && event.target === event.currentTarget) {
      this.ref.close(undefined);
    }
  }

}
