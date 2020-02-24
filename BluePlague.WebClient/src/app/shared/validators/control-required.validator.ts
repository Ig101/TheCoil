import { FormControl, Validators } from '@angular/forms';

export function controlRequiredValidator(controlName: string) {
    return (control: FormControl) => {
        const error = Validators.required(control);
        return {
            required: {
                result: !error,
                text: $localize`:@@validators.required:Required.`,
                extendedText: $localize`:@@validators.required.extended:${controlName} is empty.`
            }
        };
    };
}
