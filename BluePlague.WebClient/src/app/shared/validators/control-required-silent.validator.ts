import { FormControl, Validators } from '@angular/forms';

export function controlRequiredSilentValidator(controlName: string) {
    return (control: FormControl) => {
        const error = Validators.required(control);
        return {
            required: {
                result: !error,
                extendedText: $localize`:@@validators.required.extended:${controlName} is empty.`
            }
        };
    };
}
