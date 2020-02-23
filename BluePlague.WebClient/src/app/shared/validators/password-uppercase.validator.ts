import { FormControl, Validators } from '@angular/forms';

export function passwordUppercaseValidator(control: FormControl) {
    const error = Validators.pattern('(?=.*[A-Z]).{0,}')(control);
    return {
      maxLength: {
        result: !error,
        text: $localize`:@@validators.password-uppercase:Password should contain latin uppercase letters.`
      }
    };
}
