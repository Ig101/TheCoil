import { FormControl, Validators } from '@angular/forms';

export function passwordDigitsValidator(control: FormControl) {
    const error = Validators.pattern('(?=.*[0-9]).{0,}')(control);
    return {
      maxLength: {
        result: !error,
        text: $localize`:@@validators.password-digits:Should contain digits.`
      }
    };
}
