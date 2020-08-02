/* eslint-disable no-undef */
import {
    Injectable, Injector,
} from '@angular/core';
import {
    ControlContainer,
    FormControl,
    FormControlName,
    FormGroupDirective,
    FormGroupName,
    FormGroup,
    NgForm,
} from '@angular/forms';

@Injectable()
export class ComponentUtilsService {

    // eslint-disable-next-line class-methods-use-this
    getFormControl(injector: Injector): FormControl {
        const formControl = injector.get(FormControl, null);
        if (formControl) {
            return formControl;
        }
        const controlContainer = injector.get<ControlContainer>(ControlContainer);
        const formControlNameDir = injector.get(FormControlName, null);
        if (formControlNameDir && controlContainer instanceof FormGroupDirective) {
            return controlContainer.getControl(formControlNameDir);
        } if (formControlNameDir && (controlContainer as FormGroupName)) {
            return ((controlContainer.control as FormGroup)
                .controls[formControlNameDir.name] as FormControl);
        }
        return new FormControl('');
    }

    // eslint-disable-next-line class-methods-use-this
    getFormGroup(injector: Injector): FormGroup {
        const formGroupName: FormGroupName = injector.get<FormGroupName>(FormGroupName, null);
        const formGroup: NgForm = injector.get<NgForm>(NgForm, null);
        if (formGroupName) {
            return formGroupName.control;
        }
        return formGroup ? formGroup.control : new FormGroup({});
    }

    // eslint-disable-next-line class-methods-use-this
    isObjectEmpty(obj: any) {
        // eslint-disable-next-line consistent-return
        Object.keys(obj).forEach((key) => {
            if (obj.hasOwnProperty(key)) {
                return false;
            }
        });
        return true;
    }

    // eslint-disable-next-line class-methods-use-this
    validateEmail(email: string) {
    // eslint:disable-next-line: max-line-length
    // eslint-disable-next-line no-useless-escape
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
}
