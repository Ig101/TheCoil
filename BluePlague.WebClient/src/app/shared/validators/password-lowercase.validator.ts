import { FormControl, Validators } from '@angular/forms';

export function passwordLowercaseValidator(controlName: string) {
  return (control: FormControl) => {
    const error = Validators.pattern('(?=.*[a-z]).{0,}')(control) || Validators.required(control);
    return {
      passwordLowercase: {
        result: !error,
        text: $localize`:@@validators.password-lowercase:Should contain latin lowercase letters.`,
        extendedText:
          $localize`:@@validators.password-lowercase.extended:${controlName} should contain at least one latin lowercase letter.`
      }
    };
  };
}
