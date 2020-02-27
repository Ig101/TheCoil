import { FormGroup } from '@angular/forms';

export class AppFormGroup extends FormGroup {
  get valid() {
    if (super.valid) {
      return true;
    }
    return Object.values(this.controls).reduce((sum, next) => {
      const nextResult = Object.values(next.errors).reduce((eSum, eNext) => {
        return eSum && eNext.result;
      }, true);
      return sum && nextResult;
    }, true);
  }

  get invalid() {
    return !this.valid;
  }

  get appErrors(): string[] {
    return Object.values(this.controls).reduce((sum, next) => {
      const errors = Object.values(next.errors);
      const nextResult = errors.length > 0 ?
        errors.filter(e => !e.result).map(e => {
          return e.extendedText;
        }) : [];
      sum.push(...nextResult);
      return sum;
    }, []);
  }
}
