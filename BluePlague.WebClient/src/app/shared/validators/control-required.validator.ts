import { FormControl, Validators } from '@angular/forms';

export function controlRequiredValidator(control: FormControl) {
    const error = Validators.required(control);
    return {
        maxLength: {
            result: !error,
            text: $localize`:@@validators.required:Required.`
        }
    };
}
