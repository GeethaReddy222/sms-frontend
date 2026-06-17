import { AbstractControl, ValidationErrors } from '@angular/forms';

export function nameValidator(
    control: AbstractControl
): ValidationErrors | null {

    const value = control.value;

    if (!value) {
        return null;
    }

    const trimmedValue = value.trim();

    const namePattern = /^[a-zA-Z ]+$/;

    if (
        trimmedValue.length < 3 ||
        !namePattern.test(trimmedValue)
    ) {
        return { invalidName: true };
    }

    return null;
}