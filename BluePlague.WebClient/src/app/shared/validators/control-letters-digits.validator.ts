import { FormControl, Validators } from '@angular/forms';

export function controlLettersDigitsValidator(controlName: string) {
  return (control: FormControl) => {
    const error = Validators.pattern('^[A-Za-z0-9]*$')(control);
    return {
      lettersDigits: {
        result: !error,
        text: $localize`:@@validators.letters-digits:Should contain latin letters and digits only.`,
        extendedText: $localize`:@@validators.letters-digits.extended:${controlName} should contain latin letters and digits only.`,
      }
    };
  };
}
