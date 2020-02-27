import { FormControl, Validators } from '@angular/forms';

export function controlMaxLengthValidator(controlName: string, maxLength: number) {
    return (control: FormControl) => {
      const error = Validators.maxLength(maxLength)(control);
      return {
        maxLength: {
          result: !error,
          text: $localize`:@@validators.max-length:Should contain up to ${maxLength} letters.`,
          extendedText: $localize`:@@validators.max-length.extended:${controlName} should contain up to ${maxLength} letters.`
        }
      };
    };
}
