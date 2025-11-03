import { AbstractControl, ValidationErrors } from "@angular/forms";

export function createUrlValidator(): (control: AbstractControl) => ValidationErrors | null {
  const URL_REGEX = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
  const regex = new RegExp(URL_REGEX);

  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    
    if (!value) {
      return null;
    }

    if (typeof value !== 'string') {
        return null;
    }

    const isValid = regex.test(value);

    return isValid ? null : { invalidUrl: true };
  };
}