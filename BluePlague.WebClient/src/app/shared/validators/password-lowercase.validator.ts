import { FormControl, Validators } from '@angular/forms';

export function passwordLowercaseValidator(control: FormControl) {
    const error = Validators.pattern('(?=.*[a-z]).{0,}')(control);
    return {
      maxLength: {
        result: !error,
        text: $localize`:@@validators.password-lowercase:Password should contain latin lowercase letters.`
      }
    };
}
