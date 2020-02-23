import { FormControl, Validators } from '@angular/forms';

export function controlLettersDigitsValidator(control: FormControl) {
    const error = Validators.pattern('^[A-Za-z0-9]*$')(control);
    return {
      lettersDigits: {
        result: !error,
        text: $localize`:@@validators.letters-digits:Should contain latin letters and digits only.`
      }
    };
}
