import { FormControl, Validators } from '@angular/forms';

export function emailValidator(control: FormControl) {
    const error = Validators.email(control);
    if (error) {
        return {
            maxLength: {
                result: false,
                text: $localize`:@@validators.email-wrong:Email is wrong.`
            }
        };
    } else {
        return {
            maxLength: {
                result: true,
                text: $localize`:@@validators.email-right:Email is right.`
            }
        };
    }
}
