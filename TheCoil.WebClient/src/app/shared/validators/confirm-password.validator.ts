import { FormControl, Validators } from '@angular/forms';

export function confirmPasswordValidator(controlName: string) {
    return (control: FormControl) => {
        return {
            confirmPassword: {
                result: control.root.value.password === control.value,
                text: $localize`:@@validators.confirm-password:Passwords should be the same.`,
                extendedText: $localize`:@@validators.confirm-password.extended:${controlName} field and password field are not the same.`
            }
        };
    };
}
