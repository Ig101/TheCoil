import { Injectable, ComponentFactoryResolver, Type, ComponentFactory, ApplicationRef, Injector, EmbeddedViewRef } from '@angular/core';
import { ModalComponent } from './modal-component.interface';
import { ModalShellComponent } from './modal-shell/modal-shell.component';
import { ModalRef } from './modal-ref';

@Injectable()
export class ModalComponentFactory {

  constructor(
    private readonly componentFactoryResolver: ComponentFactoryResolver,
    private readonly appRef: ApplicationRef,
    private readonly injector: Injector,
    ) { }

  create<Tmodel, Tresult>(component: Type<ModalComponent<Tmodel, Tresult>>):
                          ModalRef<Tmodel, Tresult> {
    (document.body as HTMLElement).style.overflowY = 'hidden';
    (document.body as HTMLElement).style.overflowX = 'hidden';
    for (const modal of Array.from(document.body.querySelectorAll('app-modal-shell'))) {
      (modal as HTMLElement).style.overflowY = 'hidden';
      (modal as HTMLElement).style.overflowX = 'hidden';
    }
    const modalRef = this.componentFactoryResolver
      .resolveComponentFactory(ModalShellComponent)
      .create(this.injector);
    this.appRef.attachView(modalRef.hostView);
    const modalElement = (modalRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

    const componentRef = this.componentFactoryResolver
      .resolveComponentFactory(component)
      .create(this.injector);
    this.appRef.attachView(componentRef.hostView);
    const componentElement = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

    document.body.appendChild(modalElement);
    modalElement.querySelector('#modalBody').appendChild(componentElement);

    const result = new ModalRef<Tmodel, Tresult>(modalRef, componentRef, this.appRef);
    componentRef.instance.ref = result;
    modalRef.instance.ref = result;
    return result;
  }
}
