import { Component, OnInit, Input, forwardRef, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextInputComponent),
      multi: true
    }
  ]
})
export class TextInputComponent implements OnInit, ControlValueAccessor {

  @Input() disabled = false;
  @Input() type = 'text';
  @Input() set validations(value: ValidationErrors) {
    this.extra = Object.values(value).filter(result => result.text).map(result => {
      return {
        text: result.text,
        color: result.result ? '#0f0' : '#f00'
      };
    });
  }

  @Output() textChange = new EventEmitter<string>();

  extra: {text: string, color: string}[] = [];

  private tempValueInternal: string;

  get tempValue() {
    return this.tempValueInternal;
  }

  set tempValue(obj: any) {
    this.writeValue(obj);
  }

  constructor() { }

  onChange: any = () => {};
  onTouch: any = () => {};

  ngOnInit(): void {
  }

  writeValue(obj: any): void {
    if (typeof obj !== 'string') {
      return;
    }
    this.tempValueInternal = obj;
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
