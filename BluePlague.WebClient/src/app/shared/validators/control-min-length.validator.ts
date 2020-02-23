import { FormControl, Validators } from '@angular/forms';

export function controlMinLengthValidator(minLength: number) {
    return (control: FormControl) => {
      const error = Validators.minLength(minLength)(control);
      return {
        maxLength: {
          result: !error,
          text: $localize`:@@validators.min-length:Should contain more than ${minLength} letters.`
        }
      };
    };
}
