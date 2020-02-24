import { FormControl, Validators } from '@angular/forms';

export function passwordUppercaseValidator(controlName: string) {
  return (control: FormControl) => {
    const error = Validators.pattern('(?=.*[A-Z]).{0,}')(control) || Validators.required(control);
    return {
      passswordUppercase: {
        result: !error,
        text: $localize`:@@validators.password-uppercase: Should contain latin capital letters.`,
        extendedText:
          $localize`:@@validators.password-uppercase.extended:${controlName} should contain at least one latin capital letter.`
      }
    };
  };
}
