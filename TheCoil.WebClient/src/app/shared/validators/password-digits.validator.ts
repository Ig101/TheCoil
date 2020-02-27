import { FormControl, Validators } from '@angular/forms';

export function passwordDigitsValidator(controlName: string) {
  return (control: FormControl) => {
    const error = Validators.pattern('(?=.*[0-9]).{0,}')(control) || Validators.required(control);
    return {
      passwordDigits: {
        result: !error,
        text: $localize`:@@validators.password-digits:Should contain digits.`,
        extendedText: $localize`:@@validators.password-digits.extended:${controlName} should contain at least one digit.`
      }
    };
  };
}
