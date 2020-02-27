import { ModalRef } from './modal-ref';

export interface ModalComponent<Tmodel, Tresult> {
  ref: ModalRef<Tmodel, Tresult>;
}
