import { Component, OnInit } from '@angular/core';
import { ModalRef } from '../modal-ref';

@Component({
  selector: 'app-modal-shell',
  templateUrl: './modal-shell.component.html',
  styleUrls: ['./modal-shell.component.scss']
})
export class ModalShellComponent implements OnInit {

  ref: ModalRef<unknown, unknown>;

  constructor() { }

  ngOnInit() {
  }
}
