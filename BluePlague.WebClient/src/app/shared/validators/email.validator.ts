import { FormControl, Validators } from '@angular/forms';

export function emailValidator(controlName: string) {
    return (control: FormControl) => {
        const error = Validators.email(control) || Validators.required(control);
        if (error) {
            return {
                email: {
                    result: false,
                    text: $localize`:@@validators.email-wrong:Email is wrong.`,
                    extendedText: $localize`:@@validators.email-wrong.extended:${controlName} field contains wrong email pattern.`
                }
            };
        } else {
            return {
                email: {
                    result: true,
                    text: $localize`:@@validators.email-right:Email is right.`
                }
            };
        }
    };
}
