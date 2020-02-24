import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appFocusRemover]'
})
export class FocusRemoverDirective {

  constructor(private elRef: ElementRef) { }

  @HostListener('click') onClick() {
    this.elRef.nativeElement.blur();
  }
}
