import { SmartActionBinding } from './smart-action-binding.model';

export interface KeyState {
  key: string;
  action: SmartActionBinding;
  pressedTime: number;
}
