import { Injectable, Type } from '@angular/core';
import { ModalComponent } from '../modal/modal-component.interface';
import { ModalRef } from '../modal/modal-ref';
import { ModalComponentFactory } from '../modal/modal-component-factory';
import { Observable } from 'rxjs';

@Injectable()
export class ModalService {

  constructor(
    private readonly componentFactory: ModalComponentFactory,
  ) { }

  openModal<Tmodel, Tresult>(component: Type<ModalComponent<Tmodel, Tresult>>,
                             model: Tmodel,
                             closeOnOverlayClick: boolean = true): Observable<Tresult> {
    const result = this.componentFactory.create(component, closeOnOverlayClick);
    result.model = model;
    return result.onCloseEvent();
  }

  openModalNoModel<Tresult>(component: Type<ModalComponent<void, Tresult>>,
                            closeOnOverlayClick: boolean = true): Observable<Tresult> {
    const result = this.componentFactory.create(component, closeOnOverlayClick);
    return result.onCloseEvent();
  }
}
