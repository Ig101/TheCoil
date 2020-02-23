import { FormControl } from '@angular/forms';

export function confirmPasswordValidator(control: FormControl) {
    return {
        confirmPassword: {
            result: control.root.value.password === control.value,
            text: $localize`:@@validators.confirm-password:Passwords should be the same.`
        }
    };
}
