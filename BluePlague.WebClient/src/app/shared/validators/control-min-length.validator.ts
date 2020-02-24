import { FormControl, Validators } from '@angular/forms';

export function controlMinLengthValidator(controlName: string, minLength: number) {
    return (control: FormControl) => {
      const error = Validators.minLength(minLength)(control) || Validators.required(control);
      return {
        minLength: {
          result: !error,
          text: $localize`:@@validators.min-length:Should contain ${minLength} or more letters.`,
          extendedText: $localize`:@@validators.min-length.extended:${controlName} should contain ${minLength} or more letters.`
        }
      };
    };
}
