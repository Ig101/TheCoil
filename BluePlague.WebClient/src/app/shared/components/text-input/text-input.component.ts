import { Component, OnInit, Input } from '@angular/core';
import { ControlValueAccessor, FormControl } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss']
})
export class TextInputComponent implements OnInit, ControlValueAccessor {

  @Input() disabled = false;
  @Input() control: FormControl;

  onChange: any = () => {};
  onTouch: any = () => {};

  constructor() { }

  ngOnInit(): void {
  }

  writeValue(obj: any): void {
    if (typeof obj !== 'string') {
      return;
    }
    this.onChange(obj);
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
