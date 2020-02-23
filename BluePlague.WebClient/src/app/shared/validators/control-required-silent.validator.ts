import { FormControl, Validators } from '@angular/forms';

export function controlRequiredSilentValidator(control: FormControl) {
    const error = Validators.required(control);
    return {
        maxLength: {
            result: !error
        }
    };
}
